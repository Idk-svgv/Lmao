<file>
      <absolute_file_name>/app/backend/story_content.py</absolute_file_name>
      <content"># Solo Leveling Story Content
from typing import List, Dict, Any

def get_story_chapters() -> List[Dict[str, Any]]:
    """
    Returns detailed story chapters following the Solo Leveling manhwa narrative
    """
    return [
        {
            "chapter_number": 1,
            "title": "The Weakest Hunter",
            "description": "Begin your journey as the weakest E-rank hunter in the world",
            "content": [
                {
                    "type": "narrative",
                    "title": "The Weakest Hunter",
                    "text": "In a world where mysterious gates have opened, connecting our reality to dangerous dungeons filled with monsters, hunters are humanity's last hope. You are Sung Jin-Woo, known as the weakest hunter of all mankind.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Sung Jin-Woo",
                    "text": "Another day, another life-threatening dungeon raid... I wonder if I'll make it out alive this time.",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "The Harsh Reality",
                    "text": "As an E-rank hunter, you're barely stronger than an ordinary human. Every dungeon raid is a gamble with your life, but you need the money to pay for your mother's medical bills and your sister's education.",
                    "image": None
                },
                {
                    "type": "choice",
                    "question": "What drives you to continue as a hunter despite the danger?",
                    "options": [
                        {
                            "text": "My family needs the money",
                            "effect": "Family bond strengthened"
                        },
                        {
                            "text": "I want to prove I'm not worthless",
                            "effect": "Determination increased"
                        },
                        {
                            "text": "I have no other choice",
                            "effect": "Resilience improved"
                        }
                    ]
                },
                {
                    "type": "narrative",
                    "title": "The Daily Struggle",
                    "text": "Your fellow hunters barely acknowledge your existence. To them, you're just dead weight - someone who takes up space in the party without contributing much to the fight.",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "Chapter 1 Complete! You've begun your journey as the weakest hunter. The path ahead is dangerous, but your determination burns bright.",
                    "rewards": ["100 XP", "Basic Hunter License", "Healing Potion x3"]
                }
            ]
        },
        {
            "chapter_number": 2,
            "title": "The System Awakens",
            "description": "Discover the mysterious leveling system that will change everything",
            "content": [
                {
                    "type": "narrative",
                    "title": "The Double Dungeon",
                    "text": "During what seemed like a routine D-rank dungeon raid, your party discovers a hidden chamber with ancient stone statues and mysterious inscriptions. The air grows heavy with an ominous presence.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Party Leader",
                    "text": "Jin-Woo, you stay back. This place gives me the creeps. Let the real hunters handle this.",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "The Commandments",
                    "text": "Three commandments are carved into the walls: First, worship the god. Second, praise the god. Third, prove your faith. The party members begin to follow these rules, but something feels terribly wrong.",
                    "image": None
                },
                {
                    "type": "choice",
                    "question": "The stone statues begin to move. What do you do?",
                    "options": [
                        {
                            "text": "Warn the others about the danger",
                            "effect": "Leadership +1"
                        },
                        {
                            "text": "Try to find an escape route",
                            "effect": "Survival instinct activated"
                        },
                        {
                            "text": "Stand your ground and fight",
                            "effect": "Courage +1"
                        }
                    ]
                },
                {
                    "type": "narrative",
                    "title": "The Massacre",
                    "text": "The ancient stone soldiers come to life, mercilessly slaughtering most of your party. You watch in horror as hunters far stronger than you are cut down like wheat before a scythe.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Sung Jin-Woo",
                    "text": "Is this how I die? As the weakest hunter, forgotten by the world?",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "The Awakening",
                    "text": "Just as death seems certain, a mysterious blue window appears before your eyes. The System has awakened, offering you a second chance at life and power beyond imagination.",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "SYSTEM ACTIVATED! Congratulations, you have been selected as the Player. You are now the only person in the world who can level up!",
                    "rewards": ["System Access", "Daily Quest Feature", "Instant Dungeon Access"]
                },
                {
                    "type": "narrative",
                    "title": "Rebirth",
                    "text": "You wake up in a hospital three days later, but something is different. You can see translucent blue windows that no one else can see, and you feel... stronger.",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "Chapter 2 Complete! The System has chosen you as its Player. Your journey from the weakest to the strongest begins now!",
                    "rewards": ["500 XP", "System Interface", "Daily Quest: 'Preparation for Becoming Strong'"]
                }
            ]
        },
        {
            "chapter_number": 3,
            "title": "The First Level Up",
            "description": "Experience your first taste of real power through the System",
            "content": [
                {
                    "type": "narrative",
                    "title": "The Daily Quest",
                    "text": "The System has given you a daily quest: 100 push-ups, 100 sit-ups, 100 squats, and a 10km run. Failure to complete it within the time limit results in punishment.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "System",
                    "text": "[Daily Quest: Preparation for Becoming Strong] Complete the training regimen to grow stronger. Time limit: 24 hours. Penalty for failure: Level -1 and 2 hours in the Penalty Zone.",
                    "image": None
                },
                {
                    "type": "choice",
                    "question": "The training seems impossible for your current physical condition. What do you do?",
                    "options": [
                        {
                            "text": "Push through the pain and complete it",
                            "effect": "Willpower +2, Strength +1"
                        },
                        {
                            "text": "Try to find an easier way",
                            "effect": "Intelligence +1"
                        },
                        {
                            "text": "Give up and accept the penalty",
                            "effect": "Experience the Penalty Zone"
                        }
                    ]
                },
                {
                    "type": "narrative",
                    "title": "The Penalty Zone",
                    "text": "If you failed the quest, you're transported to a nightmarish desert filled with giant centipedes hunting you relentlessly. There's no escape except to survive for 2 hours.",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "Growth Through Struggle",
                    "text": "Whether through completing the daily quest or surviving the penalty zone, you begin to understand that the System rewards effort and punishes complacency. You can literally feel yourself getting stronger.",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "LEVEL UP! You have reached Level 2. All stats increased by 1. You have gained 3 attribute points to distribute.",
                    "rewards": ["Level 2 Achieved", "+1 to All Stats", "3 Attribute Points"]
                },
                {
                    "type": "narrative",
                    "title": "The Instant Dungeon",
                    "text": "The System grants you access to Instant Dungeons - personal training grounds where you can fight monsters and grow stronger without the risk of permanent death.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Sung Jin-Woo",
                    "text": "This power... it's like I'm playing a video game, but it's real. I can actually become stronger!",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "Chapter 3 Complete! You've experienced your first level up and gained access to Instant Dungeons. Your transformation has begun!",
                    "rewards": ["1000 XP", "Instant Dungeon Key", "Basic Combat Skills"]
                }
            ]
        },
        {
            "chapter_number": 4,
            "title": "The Shadow Extraction",
            "description": "Unlock your unique ability to extract and command shadow soldiers",
            "content": [
                {
                    "type": "narrative",
                    "title": "The Goblin Cave",
                    "text": "After weeks of training and growing stronger, you enter your first real Instant Dungeon. The goblin cave is filled with weak monsters perfect for testing your newfound abilities.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "System",
                    "text": "[Quest: Clear the Goblin Cave] Eliminate all monsters in the dungeon. Reward: New Skill Unlock",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "The Battle",
                    "text": "You fight through waves of goblins, each victory making you stronger. Your movements are faster, your strikes more precise. The weak hunter you once were is becoming a distant memory.",
                    "image": None
                },
                {
                    "type": "choice",
                    "question": "You face the Goblin Chief. How do you approach this battle?",
                    "options": [
                        {
                            "text": "Attack directly with overwhelming force",
                            "effect": "Strength focus, learn Brutal Attack"
                        },
                        {
                            "text": "Use strategy and wait for openings",
                            "effect": "Intelligence focus, learn Tactical Mind"
                        },
                        {
                            "text": "Stay mobile and strike from shadows",
                            "effect": "Agility focus, learn Stealth"
                        }
                    ]
                },
                {
                    "type": "narrative",
                    "title": "The Mysterious Skill",
                    "text": "After defeating the Goblin Chief, something extraordinary happens. A dark energy surrounds the fallen monster, and you hear a voice in your head: 'Will you extract this shadow?'",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "System",
                    "text": "[New Skill Acquired: Shadow Extraction] Extract the shadows of defeated enemies to create loyal soldiers. This skill is unique to you alone.",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "Your First Shadow",
                    "text": "You successfully extract your first shadow soldier from the Goblin Chief. The dark figure kneels before you, awaiting your commands. You are no longer fighting alone.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Sung Jin-Woo",
                    "text": "Arise! You shall serve me as my shadow soldier!",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "Shadow Extraction Successful! You have gained your first shadow soldier. The path to becoming the Shadow Monarch begins!",
                    "rewards": ["Shadow Extraction Skill", "First Shadow Soldier", "Shadow Storage Ability"]
                },
                {
                    "type": "narrative",
                    "title": "The Revelation",
                    "text": "As you command your shadow soldier, you realize the true nature of your power. You're not just getting stronger - you're becoming something far beyond a normal hunter.",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "Chapter 4 Complete! You've unlocked the Shadow Extraction skill and gained your first shadow soldier. The Shadow Monarch's power awakens within you!",
                    "rewards": ["2000 XP", "Shadow Army Capacity +10", "Title: Shadow Wielder"]
                }
            ]
        },
        {
            "chapter_number": 5,
            "title": "The Red Gate Incident",
            "description": "Face your first real test in the deadly Red Gate dungeon",
            "content": [
                {
                    "type": "narrative",
                    "title": "The C-Rank Raid",
                    "text": "You've been invited to join a C-rank dungeon raid, a significant step up from your E-rank origins. The other hunters are surprised by your presence, but you've hidden your true strength.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Hunter Kim",
                    "text": "Jin-Woo? What's an E-rank doing here? This is a C-rank dungeon, not some beginner's playground.",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "The Gate Turns Red",
                    "text": "Just as you enter the dungeon, the gate behind you turns red - a phenomena that traps everyone inside until the dungeon is cleared. The difficulty has also increased dramatically.",
                    "image": None
                },
                {
                    "type": "choice",
                    "question": "The other hunters are panicking. What do you do?",
                    "options": [
                        {
                            "text": "Reveal your true strength and take charge",
                            "effect": "Leadership +2, Gain party trust"
                        },
                        {
                            "text": "Stay hidden and observe the situation",
                            "effect": "Stealth +1, Gather information"
                        },
                        {
                            "text": "Offer to help with your shadow soldiers",
                            "effect": "Shadow Army experience +1"
                        }
                    ]
                },
                {
                    "type": "narrative",
                    "title": "The Ice World",
                    "text": "The dungeon has transformed into a frozen wasteland. Ice elves and frost beasts roam the area, and the temperature is dropping rapidly. Several hunters are already showing signs of hypothermia.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Sung Jin-Woo",
                    "text": "If we don't find shelter soon, we'll all freeze to death. I need to act, even if it means revealing my abilities.",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "The Ice Monarch",
                    "text": "At the heart of the frozen dungeon waits the Ice Monarch, a being of immense power. The other hunters are no match for it, and you must step forward to face this deadly foe.",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "The True Battle",
                    "text": "You unleash your full power, commanding your shadow army against the Ice Monarch. The other hunters watch in awe as the 'weakest hunter' displays strength beyond their imagination.",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "Boss Defeated! You have successfully defeated the Ice Monarch. Shadow Extraction available!",
                    "rewards": ["Ice Monarch's Shadow", "Frost Resistance", "Cold Weather Gear"]
                },
                {
                    "type": "narrative",
                    "title": "The Aftermath",
                    "text": "With the Ice Monarch defeated, the Red Gate opens and everyone can finally escape. The other hunters look at you with a mixture of respect and fear. You are no longer the weakest hunter.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Hunter Kim",
                    "text": "Jin-Woo... what are you? That power... it's not human.",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "Chapter 5 Complete! You've survived the Red Gate incident and gained powerful new shadow soldiers. Your reputation as a mysterious hunter begins to spread!",
                    "rewards": ["5000 XP", "Red Gate Survivor Title", "Ice Monarch Shadow Soldier"]
                }
            ]
        },
        {
            "chapter_number": 6,
            "title": "The Demon Castle",
            "description": "Face the ultimate test against the Demon King himself",
            "content": [
                {
                    "type": "narrative",
                    "title": "The S-Rank Dungeon",
                    "text": "An S-rank dungeon has appeared - the Demon Castle. This is the highest difficulty dungeon that has ever been recorded, and only the strongest hunters dare to enter.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Guild Master",
                    "text": "Jin-Woo, this is suicide. Even S-rank hunters have died in there. You should reconsider.",
                    "image": None
                },
                {
                    "type": "choice",
                    "question": "Do you enter the Demon Castle?",
                    "options": [
                        {
                            "text": "Enter alone with your shadow army",
                            "effect": "Solo challenge, maximum rewards"
                        },
                        {
                            "text": "Form a party with other S-rank hunters",
                            "effect": "Team challenge, shared rewards"
                        },
                        {
                            "text": "Wait and prepare more",
                            "effect": "Delay but gain preparation bonus"
                        }
                    ]
                },
                {
                    "type": "narrative",
                    "title": "The Demon Realm",
                    "text": "Inside the castle, you face legions of demons. Each floor presents greater challenges, and your shadow army grows stronger with each victory. This is what you were meant for.",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "The Demon King",
                    "text": "At the castle's peak sits the Demon King, a being of pure malevolence. He recognizes your power and the threat you represent to his kind.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Demon King",
                    "text": "So, the Shadow Monarch has awakened. I have waited eons for this moment. Come, let us finish what was started long ago!",
                    "image": None
                },
                {
                    "type": "narrative",
                    "title": "The Final Battle",
                    "text": "The battle against the Demon King is epic, shaking the very foundations of the castle. You command your entire shadow army in a war that transcends mortal understanding.",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "DEMON KING DEFEATED! You have unlocked your true power as the Shadow Monarch. All previous limitations are removed!",
                    "rewards": ["Shadow Monarch Title", "Demon King's Shadow", "Unlimited Shadow Army"]
                },
                {
                    "type": "narrative",
                    "title": "The Awakening",
                    "text": "As the Demon King falls, you feel a fundamental change within yourself. You are no longer just a hunter with the System - you are the Shadow Monarch, ruler of death itself.",
                    "image": None
                },
                {
                    "type": "dialogue",
                    "speaker": "Sung Jin-Woo",
                    "text": "I am no longer Sung Jin-Woo the weakest hunter. I am the Shadow Monarch, and death bows to my will.",
                    "image": None
                },
                {
                    "type": "system_message",
                    "text": "Chapter 6 Complete! You have become the Shadow Monarch and unlocked your true destiny. The world of hunters will never be the same!",
                    "rewards": ["Shadow Monarch Transformation", "Demon King Shadow", "Monarch Powers Unlocked"]
                }
            ]
        }
    ]

def get_chapter_by_number(chapter_number: int) -> Dict[str, Any]:
    """Get a specific chapter by number"""
    chapters = get_story_chapters()
    for chapter in chapters:
        if chapter["chapter_number"] == chapter_number:
            return chapter
    return None

def get_total_chapters() -> int:
    """Get the total number of available chapters"""
    return len(get_story_chapters())</content>
    </file>