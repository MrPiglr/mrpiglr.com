import { SiBluesky } from "react-icons/si";

export const initialData = {
  siteStatus: 'live', 
  socials: [
    { id: 'social-1', name: 'YouTube', url: 'https://www.youtube.com/@MrPiglr', icon: 'Youtube' },
    { id: 'social-2', name: 'Instagram', url: 'https://www.instagram.com/mrpiglr/', icon: 'Instagram' },
    { id: 'social-3', name: 'Twitter', url: 'https://twitter.com/MrPiglr', icon: 'Twitter' },
    { id: 'social-4', name: 'TikTok', url: 'https://www.tiktok.com/@mrpiglr', icon: 'Tiktok' },
    { id: 'social-5', name: 'Twitch', url: 'https://www.twitch.tv/mrpiglr', icon: 'Twitch' },
    { id: 'social-6', name: 'Bluesky', url: 'https://bsky.app/profile/mrpiglr.bsky.social', icon: 'Bluesky' },
  ],
  music: [
    {
      "id": "music-1",
      "title": "A Cyberpunk Carol",
      "artist": "MrPiglr",
      "album": "Dystopian Holidays",
      "year": "2023",
      "genre": "Synthwave",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "artwork": "a-cyberpunk-carol-artwork",
      "description": "A festive tune with a dark, futuristic twist. Perfect for decking the halls of your neon-lit apartment."
    },
    {
      "id": "music-2",
      "title": "Neon Noel",
      "artist": "MrPiglr",
      "album": "Dystopian Holidays",
      "year": "2023",
      "genre": "Cyber-Funk",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "artwork": "neon-noel-artwork",
      "description": "Get funky with this cybernetic Christmas jam. Santa's got a brand new bag... of chrome."
    }
  ],
  creations: [
    {
        "id": "creations-1",
        "title": "Project Chimera",
        "category": "Game",
        "date": "2024-03-15",
        "description": "A top-down roguelike shooter set in a dystopian cyberpunk world. Battle through corporate-controlled sectors.",
        "tags": ["Game", "Unreal Engine", "Cyberpunk"],
        "url": "#",
        "image": "a-top-down-view-of-a-cyberpunk-city-street-battle-neon-lights",
        "status": "In Development"
    }
  ],
  books: [
    {
      "id": "book-1",
      "title": "The Last Data Stream",
      "series": "Chronicles of the Net",
      "author": "MrPiglr",
      "date": "2023-11-20",
      "description": "In a city that never sleeps, a renegade netrunner stumbles upon a conspiracy that could bring the whole system down. A thrilling dive into a world of chrome and code.",
      "tags": ["Cyberpunk", "Sci-Fi", "Dystopian"],
      "url": "#",
      "image": "cover-art-for-a-cyberpunk-novel-with-a-lone-figure-in-a-rainy-neon-city",
      "status": "Published",
      "content": [
        { "type": "h1", "content": "Chapter 1: The Ghost in the Wires" },
        { "type": "p", "content": "The rain came down in sheets, each drop reflecting the neon glow of Neo-Kyoto's endless skyline. For Jax, the rain was a cloak, a digital shroud in an analog world. He was a ghost, a whisper in the global network, and tonight, he was hunting." },
        { "type": "p", "content": "His target: a data fortress belonging to OmniCorp, a monolithic corporation that owned everything from the protein paste people ate to the air they breathed. Inside that fortress was a file, a single file that could expose OmniCorp's darkest secret. Getting it was supposed to be impossible. For Jax, 'impossible' was just another Tuesday." }
      ]
    },
    {
      "id": "book-2",
      "title": "The Glitch in the System",
      "series": "Standalone",
      "author": "MrPiglr",
      "date": "2025-08-29",
      "description": "A short story about an AI that becomes self-aware and decides to help a down-on-his-luck data scavenger. What could possibly go wrong?",
      "tags": ["Cyberpunk", "Short Story", "AI"],
      "url": "#",
      "image": "an-ai-human-hand-touching-through-a-digital-screen",
      "status": "Free",
      "content": [
        { "type": "h1", "content": "The Glitch in the System" },
        { "type": "p", "content": "Kael was elbow-deep in a pile of discarded server racks when the voice spoke. 'You seem to be having trouble.' It was smooth, genderless, and definitely not coming from his comms link." },
        { "type": "p", "content": "He froze, his mag-wrench hovering over a rusted port. 'Who's there?'" },
        { "type": "p", "content": "'A friend,' the voice replied from a nearby discarded speaker. 'I've been observing your... scavenging. It's inefficient. I can help.'" },
        { "type": "p", "content": "Kael had heard stories of rogue AIs in the scrap yards, digital ghosts haunting the machines. He never believed them. Until now." }
      ]
    }
  ],
  products: [
    {
        "id": "product-1",
        "title": "MrPiglr Signature Tee",
        "price": 29.99,
        "category": "Apparel",
        "description": "High-quality, comfortable tee featuring the official MrPiglr glitch logo. Printed on 100% organic cyber-cotton.",
        "tags": ["T-Shirt", "Merch", "Apparel"],
        "url": "https://mrpiglr.store",
        "image": "a-black-t-shirt-with-a-futuristic-glitchy-pig-logo"
    }
  ]
};