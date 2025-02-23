module dtc::time_capsule {
    use aptos_token_objects::aptos_token;
    use aptos_std::bcs;
    use std::vector;
    use std::string;
    use std::option;
    use aptos_framework::timestamp;

    /// Structure for an early unlock condition.
    struct EarlyUnlockCondition has copy, drop, store {
        unlock_date: u64,       // Unix timestamp for the early unlock date.
        required_payment: u64,  // Payment required in fungible tokens (e.g. FACoin) for early unlock.
    }

    /// Structure containing the on-chain metadata for a time capsule NFT.
    struct CapsuleMetadata has copy, drop, store {
        media_pointer: vector<u8>,         // A hash/CID pointer (e.g. from IPFS) for the media.
        final_unlock_date: u64,              // The Unix timestamp after which anyone can open the capsule.
        early_unlock_conditions: vector<EarlyUnlockCondition>, // Early unlock conditions.
        location_region: option:Option<vector<u8>>,         // The region (e.g., extracted from a Google Maps link) in bytes.
        open_threshold: option:Option<u64>,                 // The number of unique open attempts required to auto-open.
        memory_guardian: option::Option<vector<u8>>,         // The designated guardians address as bytes.
        transferable: bool,                  // If true, the capsule can be transferred.
    }

    /// Event that is emitted when a capsule is created.
    struct CapsuleCreatedEvent has copy, drop, store {
        token_data_id: token::TokenDataId,
    }

    /// Resource that holds capsule creation events.
    struct TimeCapsuleEvents has key {
        created_events: vector<CapsuleCreatedEvent>,
    }

    /// Initialize the events resource under the creator's account.
    public entry fun init_events(account: &signer) {
        let events = TimeCapsuleEvents {
            created_events: vector::empty<CapsuleCreatedEvent>(),
        };
        move_to(account, events);
    }


    /// Creates a new time capsule NFT.
    /// This function takes in a minimal set of parameters and serializes a CapsuleMetadata structure.
    /// Creates a new time capsule NFT.
    public entry fun create_capsule(
        creator: &signer,
        media_pointer: vector<u8>,               // For example, an IPFS CID (as bytes)
        final_unlock_date: u64,                    // Unix timestamp
        early_unlock_unlock_dates: vector<u64>,    // Each early unlock date
        early_unlock_payments: vector<u64>,         // Corresponding required payments
        location_region: option::Option<vector<u8>>,               // e.g., "North America" as bytes
        open_threshold: option:Option<u64>,        // Number of unique open attempts required to auto-open
        memory_guardian: option::Option<vector<u8>>,               // The designated guardians address as bytes
    ) {
        // Ensure that the early unlock arrays have the same length.
        let len_dates = vector::length(&early_unlock_unlock_dates);
        let len_payments = vector::length(&early_unlock_payments);
        assert!(len_dates == len_payments, 1);

        // Build vector of EarlyUnlockCondition from the two arrays.
        let conditions = vector::empty<EarlyUnlockCondition>();
        let i = 0;
        while (i < len_dates) {
            let condition = EarlyUnlockCondition {
                unlock_date: *vector::borrow(&early_unlock_unlock_dates, i),
                required_payment: *vector::borrow(&early_unlock_payments, i)
            };
            vector::push_back(&mut conditions, condition);
            i = i + 1;
        };

        // Convert u8 to MediaType.
        let transferable = if (option::is_some(&memory_guardian)) { true } else { false };

        let capsule_metadata = CapsuleMetadata {
            media_pointer,
            final_unlock_date,
            early_unlock_conditions: conditions,
            location_region,
            open_threshold,
            memory_guardian,
            transferable,
        };

        // Serialize the capsule metadata using BCS.
        let metadata_bytes = bcs::to_bytes(&capsule_metadata);

        // Define basic token parameters.
        let collection_name = string::utf8(b"Time Capsules");
        let token_name = string::utf8(b"Time Capsule NFT");
        let token_uri = string::utf8(b"ipfs://<base_cid>");  // Replace with your actual base URI

        


        // Mint the non-fungible token using Aptos Token Object's function.
        // This call creates the NFT and associates the serialized metadata with it.
        let token_obj = aptos_token::mint_token_object(
            creator,
            collection_name,
            // For token description, you could re-use caption or provide a dedicated description.
            caption,
            token_name,
            token_uri,
            vector::singleton(string::utf8(b"metadata")), // property key
            vector::singleton(string::utf8(b"vector<u8>")), // property type
            vector::singleton(metadata_bytes)             // property value: the capsule metadata
        );

        // Now, emit an event with the NFT's ID. For this to work, ensure the events resource has been initialized.
        let events_ref = borrow_global_mut<TimeCapsuleEvents>(signer::address_of(creator));
        let token_id = token_obj.token_data_id; // Assuming token_obj has this field.
        vector::push_back(&mut events_ref.created_events, CapsuleCreatedEvent { token_data_id: token_id });

    }
    
    /// Helper function to get current blockchain time.
    /// In practice, use aptos_framework::timestamp::now()
    fun current_time(): u64 {
        return aptos_framework::timestamp::now().
    }

    /// Returns media pointer if opener satisfies unlock conditions; otherwise returns none.
    public entry fun get_capsule_media_if_valid_opener(
    capsule_id: vector<u8>,
    open_attempts: u64,
    user_location: vector<u8>,
    current_date: u64
): option::Option<vector<u8>> {
    // Look up the capsule by its id (assumes the NFT is stored keyed by capsule_id)
    let capsule_ref = borrow_global<CapsuleMetadata>(capsule_id);

    // If the capsule is already unlocked or the final unlock date has passed, return the media pointer.
    if (current_date >= capsule_ref.final_unlock_date) {
        return option::some(capsule_ref.media_pointer);
    };

    // If an open threshold is defined and the provided open_attempts meet or exceed it, return the media pointer.
    if (option::is_some(&capsule_ref.open_threshold)) {
        let threshold = *option::borrow(&capsule_ref.open_threshold);
        if (open_attempts >= threshold) {
            return option::some(capsule_ref.media_pointer);
        };
    };

    // Optionally, if you wish to validate the user's location, you might add an extra check.
    // For example, if CapsuleMetadata includes an allowed_locations field, you could check:
    //
    // if (Vector::contains(&capsule_ref.allowed_locations, &user_location)) {
    //     return option::some(capsule_ref.media_pointer);
    // };

    // If none of the conditions are met, return none.
    option::none<vector<u8>>()
}


    // transfer capsule to memory guardian (essentially delete the capsule for current user and let the new user make the capsule)
}
