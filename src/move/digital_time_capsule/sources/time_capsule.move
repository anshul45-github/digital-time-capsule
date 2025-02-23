module dtc::time_capsule {
    use aptos_token_objects::aptos_token;
    use aptos_token_objects::aptos_token::AptosToken;
    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::collection;
    use std::bcs;
    use aptos_std::from_bcs;
    use aptos_token_objects::property_map;
    use std::vector;
    use std::string;
    use std::option;
    use std::signer;
    use std::string::String; // Import String explicitly
    use aptos_framework::event;


    /// Structure containing the on-chain metadata for a time capsule NFT.
    struct CapsuleMetadata has copy, drop, store {
        media_pointer: string::String,         // A hash/CID pointer (e.g. from IPFS) for the media.
    }

    #[event]
    struct CapsuleEvent has copy, drop, store {
        token_data_id: address,
    }


    public fun get_capsule_metadata(token: Object<AptosToken>): CapsuleMetadata {
        let (_, media_ptr_bytes) = property_map::read(&token, &string::utf8(b"media_pointer"));
        let media_pointer = from_bcs::to_string(media_ptr_bytes); // We want the link as a string

        CapsuleMetadata {
            media_pointer,
        }
    }

    inline fun borrowFromAddress(token: address): Object<AptosToken> {
        object::address_to_object<AptosToken>(token)
    }

    /// Creates a new time capsule NFT.
    /// This function takes in a minimal set of parameters and serializes a CapsuleMetadata structure.
    /// Creates a new time capsule NFT.
    public entry fun create_capsule(
        creator: &signer,
        media_pointer: string::String,               // For example, an IPFS CID (as bytes)
        caption: string::String,
        make_new_collection: bool,
    ) {

        let capsule_metadata = CapsuleMetadata {
            media_pointer,
        };

        let keys = vector::empty<String>();
        let types = vector::empty<String>();
        let values = vector::empty<vector<u8>>();

        vector::push_back(&mut keys, string::utf8(b"media_pointer"));
        vector::push_back(&mut types, string::utf8(b"string::String"));
        vector::push_back(&mut values, bcs::to_bytes(&capsule_metadata.media_pointer));


        // Define basic token parameters.
        let collection_name = string::utf8(b"Time Capsules");
        let token_name = string::utf8(b"Time Capsule NFT");
        let token_uri = string::utf8(b"some uri");  // Replace with your actual base URI

        
        let _collection_addr = collection::create_collection_address(&signer::address_of(creator), &collection_name);
        if (make_new_collection) {
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
        let caps = CapsuleEvent {
            token_data_id: token_id
        };
        event::emit<CapsuleEvent>(caps);

    }

    
    /// Helper function to get current blockchain time.
    /// In practice, use aptos_framework::timestamp::now()
    fun current_time(): u64 {
        return aptos_framework::timestamp::now_seconds()
    }

    
    /// Returns media pointer if opener satisfies unlock conditions; otherwise returns none.
    #[view]
    public fun get_capsule_media_if_valid_opener(
        capsule_id: address, //Stored obj as id in json format in db
        final_unlock_date: u64,
        open_attempts: u64,
        open_threshold: option::Option<u64>,
        location_region: option::Option<string::String>, // The location region of the user
        user_location: string::String, // The location of the user
        current_date: u64,
        early_unlock_dates: vector<u64>, // The dates of the early unlock conditions
        early_unlock_plan: option::Option<u64>, // The earliestUnlockable date of the earliest unlock condition to be sent here. Go over all the plans bought and find the one that has lowest date 
    ): string::String {
        // Look up the capsule by its id (assumes the NFT is stored keyed by capsule_id)
        let capsule = borrowFromAddress(capsule_id);
        let capsule_metadata = get_capsule_metadata(capsule);

        // If the capsule is already unlocked or the final unlock date has passed, return the media pointer.
        if (current_date >= final_unlock_date) {
            return capsule_metadata.media_pointer;
        };

        // Check if location is required and if it matches the user's location area, then only allow opening else return null
        // If a location is required, check that the user's location matches.
        if (option::is_some(&location_region)) {
            let region = *option::borrow(&location_region);
            if (region != user_location) {
                return string::utf8(b"");
            }
        };


        // If an open threshold is defined and the provided open_attempts meet or exceed it, return the media pointer.
        if (option::is_some(&open_threshold)) {
            let threshold = *option::borrow(&open_threshold);
            if (open_attempts >= threshold) {
                return capsule_metadata.media_pointer;
            };
        };

        // Check if user has made the payment for any one of the early unlock conditions and check if the date is less than the unlock date
        // The payment has been done
        // Send the media pointer accordingly

        let len = vector::length(&early_unlock_dates);
        if (len > 0) {
            let plan_val = *option::borrow(&early_unlock_plan);
            let i = 0;
            while (i < len) {
                let unlock_date = *vector::borrow(&early_unlock_dates, i);
                // If the current date is before the condition's unlock date...
                if (plan_val <= unlock_date) {
                    if (plan_val <= current_date){
                        return capsule_metadata.media_pointer;
                    }
                };
                i = i + 1;
            };
        };


        // If none of the conditions are met, return none.
        string::utf8(b"")
    }


    // transfer capsule to memory guardian (essentially delete the capsule for current user and let the new user make the capsule)
    // We invoke this after the memory guardian has accepted the invite to see this. Other wise we will just drop it
    public entry fun transfer_to_memory_guardian(
        capsule_id: address,
        creator: &signer,
        guardian: address,
    ) {
        //NOTE: We are supposed to open this only and only when we have made sure that transferable field on the db is true. That field should be made false as this contract evaluates
        let capsule = borrowFromAddress(capsule_id);

        assert!(object::owner(capsule) == signer::address_of(creator), 1);
        object::transfer(creator, capsule, guardian);
        assert!(object::owner(capsule) == guardian, 1);

    }

    #[test(creator = @0x1, guardian = @0x2)]
    fun test_create_capsule_and_view() {

        // Create a capsule.
        let media_ptr = string::utf8(b"https://ipfs.io/ipfs/test-cid");
        let caption = string::utf8(b"Test Capsule");
        create_capsule(&signer::borrow_address(@0x1), media_ptr, caption, true);

        // For simplicity, assume the capsule we just created is the first event.
        let event = *vector::borrow(&events_ref.created_events, 0);
        let token_id = event.token_data_id;

        // Set test parameters for unlocking.
        let final_unlock_date = 1000;
        let open_attempts = 0;
        let open_threshold = option::none<u64>();
        let location_region = option::none<String>();
        let user_location = string::utf8(b""); // no location required
        let current_date = 2000;
        let early_unlock_dates = vector::empty<u64>();
        let early_unlock_plan = option::none<u64>();

        // Call the view function.
        let result = get_capsule_media_if_valid_opener(
            token_id,
            final_unlock_date,
            open_attempts,
            open_threshold,
            location_region,
            user_location,
            current_date,
            early_unlock_dates,
            early_unlock_plan
        );

        // Assert that the media pointer returned matches what we set.
        assert!(result == string::utf8(b"https://ipfs.io/ipfs/test-cid"), 1);
    }

    #[test(creator = @0x1, guardian = @0x2)]
    fun test_transfer_to_memory_guardian() {

        // Create a capsule.
        let media_ptr = string::utf8(b"https://ipfs.io/ipfs/test-cid");
        let caption = string::utf8(b"Test Capsule");
        create_capsule(&signer::borrow(@0x1), media_ptr, caption, true);

        // Retrieve the token id from events.
        let events_ref = borrow_global<TimeCapsuleEvents>(signer::address_of(&signer::borrow(@0x1)));
        let event = *vector::borrow(&events_ref.created_events, 0);
        let token_id = event.token_data_id;

        // Transfer the token from creator (@0x1) to guardian (@0x2).
        transfer_to_memory_guardian(token_id, &signer::borrow(@0x1), signer::address_of(&signer::borrow(@0x2)));

        // Verify transfer: the token's owner should now be @0x2.
        let token_obj = borrowFromAddress(token_id);
        assert!(object::owner(token_obj) == signer::address_of(&signer::borrow(@0x2)), 2);
    }
}


