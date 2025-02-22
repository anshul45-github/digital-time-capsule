module dtc::time_capsule {
    use aptos_token_objects::aptos_token;
    use aptos_std::bcs;
    use std::vector;
    use std::string;
    use std::option;


    /// An enum representing the type of media contained in the capsule.
    enum MediaType has copy, drop, store {
        Image,
        Text,
        Video,
        Audio
    }

    /// Structure for an early unlock condition.
    struct EarlyUnlockCondition has copy, drop, store {
        unlock_date: u64,       // Unix timestamp for the early unlock date.
        required_payment: u64,  // Payment required in fungible tokens (e.g. FACoin) for early unlock.
    }

    /// Structure containing the on-chain metadata for a time capsule NFT.
    struct CapsuleMetadata has copy, drop, store {
        media_pointer: vector<u8>,         // A hash/CID pointer (e.g. from IPFS) for the media.
        media_type: MediaType,               // The type of media.
        caption: string::String,                 // A short caption (stored as bytes).
        tags: vector<string::String>,            // An array of tag strings (each as bytes).
        final_unlock_date: u64,              // The Unix timestamp after which anyone can open the capsule.
        early_unlock_conditions: vector<EarlyUnlockCondition>, // Early unlock conditions.
        location_region: vector<u8>,         // The region (e.g., extracted from a Google Maps link) in bytes.
        is_public: bool,                     // True if publicly viewable; false if restricted.
        open_threshold: option:Option<u64>,                 // The number of unique open attempts required to auto-open.
        open_attempts: u64,                  // The current number of open attempts.
        memory_guardian: option::Option<vector<u8>>,         // The designated guardians address as bytes.
        transferable: bool,                  // If true, the capsule can be transferred.
    }

    /// Creates a new time capsule NFT.
    /// This function takes in a minimal set of parameters and serializes a CapsuleMetadata structure.
/// Creates a new time capsule NFT.
    /// This entry function serializes the capsule metadata and mints an NFT using the Aptos Token Object standard.
    /// Instead of accepting custom types directly, this function uses supported types:
    /// - `media_type_val`: u8 (0 = Image, 1 = Text, 2 = Video, 3 = Audio)
    /// - `early_unlock_unlock_dates`: vector<u64>
    /// - `early_unlock_payments`: vector<u64>
    public entry fun create_capsule(
        creator: &signer,
        media_pointer: vector<u8>,               // For example, an IPFS CID (as bytes)
        media_type_val: u8,                        // 0: Image, 1: Text, 2: Video, 3: Audio
        caption: string::String,                   // e.g., "Happy New Year!"
        tags: vector<string::String>,              // e.g., ["celebration", "2025"]
        final_unlock_date: u64,                    // Unix timestamp
        early_unlock_unlock_dates: vector<u64>,    // Each early unlock date
        early_unlock_payments: vector<u64>,         // Corresponding required payments
        location_region: vector<u8>,               // e.g., "North America" as bytes
        is_public: bool,
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
        let mtype = if (media_type_val == 0) { MediaType::Image }
                    else if (media_type_val == 1) { MediaType::Text }
                    else if (media_type_val == 2) { MediaType::Video }
                    else if (media_type_val == 3) { MediaType::Audio }
                    else { abort 100 };

        let transferable = if (option::is_some(&memory_guardian)) { true } else { false };

        let capsule_metadata = CapsuleMetadata {
            media_pointer,
            media_type: mtype,
            caption,
            tags,
            final_unlock_date,
            early_unlock_conditions: conditions,
            location_region,
            is_public,
            open_threshold,
            open_attempts: 0,
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
        aptos_token::mint_token_object(
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
    }

    // Update open attempts for a capsule.
    // Open capsule contract
    // transfer capsule to memory guardian (essentially delete the capsule for current user and let the new user make the capsule)
}
