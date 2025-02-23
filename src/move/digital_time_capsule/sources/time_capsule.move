module dtc::time_capsule {
    use aptos_token_objects::aptos_token;
    use aptos_token_objects::aptos_token::AptosToken;
    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::collection;
    use aptos_std::bcs;
    use aptos_std::from_bcs;
    use aptos_token_objects::property_map;
    use std::vector;
    use std::string;
    use std::option;
    use std::signer;
    use std::error;
    use std::string::String; // Import String explicitly


    const ETOKEN_DOES_NOT_EXIST: u64 = 1;

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
        location_region: option::Option<vector<u8>>,         // The region (e.g., extracted from a Google Maps link) in bytes.
        open_threshold: option::Option<u64>,                 // The number of unique open attempts required to auto-open.
        memory_guardian: option::Option<vector<u8>>,         // The designated guardians address as bytes.
    }

    /// Event that is emitted when a capsule is created.
    struct CapsuleCreatedEvent has copy, drop, store {
        token_data_id: address,
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

    public fun get_capsule_metadata(token: Object<AptosToken>): CapsuleMetadata acquires property_map::PropertyMap {
        // Read and decode each property by key.
        let (_, media_ptr_bytes) = property_map::read(&token, &string::utf8(b"media_pointer"));
        let media_pointer = from_bcs::from_bytes<vector<u8>>(media_ptr_bytes);

        let (_, final_unlock_date_bytes) = property_map::read(&token, &string::utf8(b"final_unlock_date"));
        let final_unlock_date = from_bcs::from_bytes<u64>(final_unlock_date_bytes);

        let (_, early_unlock_conditions_bytes) = property_map::read(&token, &string::utf8(b"early_unlock_conditions"));
        let early_unlock_conditions = from_bcs::from_bytes<vector<EarlyUnlockCondition>>(early_unlock_conditions_bytes);

        let (_, location_region_bytes) = property_map::read(&token, &string::utf8(b"location_region"));
        let location_region = from_bcs::from_bytes<option::Option<vector<u8>>>(location_region_bytes);

        let (_, open_threshold_bytes) = property_map::read(&token, &string::utf8(b"open_threshold"));
        let open_threshold = from_bcs::from_bytes<option::Option<u64>>(open_threshold_bytes);

        let (_, memory_guardian_bytes) = property_map::read(&token, &string::utf8(b"memory_guardian"));
        let memory_guardian = from_bcs::from_bytes<option::Option<vector<u8>>>(memory_guardian_bytes);

        CapsuleMetadata {
            media_pointer,
            final_unlock_date,
            early_unlock_conditions,
            location_region,
            open_threshold,
            memory_guardian
        }
    }

    inline fun borrowFromAddress(token: address): Object<AptosToken> {
        object::address_to_object<AptosToken>(token)
    }

    public fun collection_exists(addr: address): bool {
        exists<collection::Collection>(addr)
    }

    /// Creates a new time capsule NFT.
    /// This function takes in a minimal set of parameters and serializes a CapsuleMetadata structure.
    /// Creates a new time capsule NFT.
    public entry fun create_capsule(
        creator: &signer,
        media_pointer: vector<u8>,               // For example, an IPFS CID (as bytes)
        caption: string::String,
        final_unlock_date: u64,                    // Unix timestamp
        early_unlock_unlock_dates: vector<u64>,    // Each early unlock date
        early_unlock_payments: vector<u64>,         // Corresponding required payments
        location_region: option::Option<vector<u8>>,               // e.g., "North America" as bytes
        open_threshold: option::Option<u64>,        // Number of unique open attempts required to auto-open
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


        let capsule_metadata = CapsuleMetadata {
            media_pointer,
            final_unlock_date,
            early_unlock_conditions: conditions,
            location_region,
            open_threshold,
            memory_guardian,
        };

        let keys = vector::empty<String>();
        let types = vector::empty<String>();
        let values = vector::empty<vector<u8>>();

        vector::push_back(&mut keys, string::utf8(b"media_pointer"));
        vector::push_back(&mut types, string::utf8(b"vector<u8>"));
        vector::push_back(&mut values, bcs::to_bytes(&capsule_metadata.media_pointer));

        vector::push_back(&mut keys, string::utf8(b"final_unlock_date"));
        vector::push_back(&mut types, string::utf8(b"u64"));
        vector::push_back(&mut values, bcs::to_bytes(&capsule_metadata.final_unlock_date));

        vector::push_back(&mut keys, string::utf8(b"early_unlock_conditions"));
        vector::push_back(&mut types, string::utf8(b"vector<EarlyUnlockCondition>"));
        vector::push_back(&mut values, bcs::to_bytes(&capsule_metadata.early_unlock_conditions));

        vector::push_back(&mut keys, string::utf8(b"location_region"));
        vector::push_back(&mut types, string::utf8(b"option<vector<u8>>"));
        vector::push_back(&mut values, bcs::to_bytes(&capsule_metadata.location_region));

        vector::push_back(&mut keys, string::utf8(b"open_threshold"));
        vector::push_back(&mut types, string::utf8(b"option<u64>"));
        vector::push_back(&mut values, bcs::to_bytes(&capsule_metadata.open_threshold));

        vector::push_back(&mut keys, string::utf8(b"memory_guardian"));
        vector::push_back(&mut types, string::utf8(b"option<vector<u8>>"));
        vector::push_back(&mut values, bcs::to_bytes(&capsule_metadata.memory_guardian));



        // Define basic token parameters.
        let collection_name = string::utf8(b"Time Capsules");
        let token_name = string::utf8(b"Time Capsule NFT");
        let token_uri = string::utf8(b"some uri");  // Replace with your actual base URI

        
        let collection_addr = collection::create_collection_address(&signer::address_of(creator), &collection_name);
        if (!collection_exists(collection_addr)) {
            // Collection does not exist; create it.
            let description = string::utf8(b"Time Capsules Collection");
            let max_supply = 1000;
            let uri = string::utf8(b"https://your.collection.uri/");
            aptos_token::create_collection(
                creator,
                description,
                max_supply,
                collection_name,
                uri,
                /* mutable_description */ true,
                /* mutable_royalty */ true,
                /* mutable_uri */ true,
                /* mutable_token_description */ true,
                /* mutable_token_name */ true,
                /* mutable_token_properties */ true,
                /* mutable_token_uri */ true,
                /* tokens_burnable_by_creator */ true,
                /* tokens_freezable_by_creator */ true,
                0,
                1
            );
        } else {
            // Collection exists; skip creation.
        };


        // Mint the non-fungible token using Aptos Token Object's function.
        // This call creates the NFT and associates the serialized metadata with it.
        let token_obj = aptos_token::mint_token_object(
            creator,
            collection_name,
            // For token description, you could re-use caption or provide a dedicated description.
            caption,
            token_name,
            token_uri,
            keys,
            types,
            values
        );

        let token_id = object::object_address(&token_obj);

        // Now, emit an event with the NFT's ID. For this to work, ensure the events resource has been initialized.
        let events_ref = borrow_global_mut<TimeCapsuleEvents>(signer::address_of(creator));
        vector::push_back(&mut events_ref.created_events, CapsuleCreatedEvent { token_data_id: token_id });

    }

    
    /// Helper function to get current blockchain time.
    /// In practice, use aptos_framework::timestamp::now()
    fun current_time(): u64 {
        return aptos_framework::timestamp::now_seconds()
    }

    /// Returns media pointer if opener satisfies unlock conditions; otherwise returns none.
    public entry fun get_capsule_media_if_valid_opener(
        capsule_id: address, //Stored obj as id in json format in db
        open_attempts: u64,
        user_location: vector<u8>,
        current_date: u64,
        early_unlock_plan: option::Option<u64>, // The earliestUnlockable of the earliest unlock condition to be sent here. Go over all the plans bought and find the one that has lowest date 
): option::Option<vector<u8>> {
    // Look up the capsule by its id (assumes the NFT is stored keyed by capsule_id)
    let capsule = borrowFromAddress(capsule_id);
    let capsule_metadata = get_capsule_metadata(capsule);

    // If the capsule is already unlocked or the final unlock date has passed, return the media pointer.
    if (current_date >= capsule_metadata.final_unlock_date) {
        return option::some(capsule_metadata.media_pointer);
    };

    // Check if location is required and if it matches the user's location area, then only allow opening else return null
    // If a location is required, check that the user's location matches.
    if (option::is_some(&capsule_metadata.location_region)) {
        let required_location = *option::borrow(&capsule_metadata.location_region);
        if (required_location != user_location) {
            return option::none<vector<u8>>();
        }
    };


    // If an open threshold is defined and the provided open_attempts meet or exceed it, return the media pointer.
    if (option::is_some(&capsule_metadata.open_threshold)) {
        let threshold = *option::borrow(&capsule_metadata.open_threshold);
        if (open_attempts >= threshold) {
            return option::some(capsule_metadata.media_pointer);
        };
    };

    // Check if user has made the payment for any one of the early unlock conditions and check if the date is less than the unlock date
    // The payment has been done
    // Send the media pointer accordingly

    let len = vector::length(&capsule_metadata.early_unlock_conditions);
    if (option::is_some(&early_unlock_plan)) {
        let plan_val = *option::borrow(&early_unlock_plan);
        let i = 0;
        while (i < len) {
            let condition = *vector::borrow(&capsule_metadata.early_unlock_conditions, i);
            // If the current date is before the condition's unlock date...
            if (plan_val <= condition.unlock_date) {
                if (plan_val <= current_date){
                    return option::some(capsule_metadata.media_pointer);
                }
            };
            i = i + 1;
        };
    };


    // If none of the conditions are met, return none.
    option::none<vector<u8>>()
}


    // transfer capsule to memory guardian (essentially delete the capsule for current user and let the new user make the capsule)
    // We invoke this after the memory guardian has accepted the invite to see this. Other wise we will just drop it
        public entry fun transfer_to_memory_guardian(
        capsule_id: address,
        guardian: &signer,
    ) {
        //NOTE: We are supposed to open this only and only when we have made sure that transferable field on the db is true. That field should be made false as this contract evaluates
        let capsule = borrowFromAddress(capsule_id);
        let capsule_metadata = get_capsule_metadata(capsule);
        // Move (delete) the capsule resource from storage.
        let capsuleRef = move_from<AptosToken>(capsule_id);
        
        // Ensure that a memory guardian was assigned.
        if (!option::is_some(&capsule_metadata.memory_guardian)) {
            // No guardian was set; abort with an error code.
            abort(100);
        };

        // Retrieve the stored memory guardian (as a vector<u8>).
        let stored_guardian = *option::borrow(&capsule_metadata.memory_guardian);

        // Convert the caller's address to a vector<u8> via BCS.
        let caller_bytes = bcs::to_bytes(&signer::address_of(guardian));

        // Check that the caller is indeed the designated memory guardian.
        if (stored_guardian != caller_bytes) {
            // Unauthorized: the caller's address does not match the stored guardian.
            abort(101);
        };

        move_to(guardian, capsuleRef);

    }

}
