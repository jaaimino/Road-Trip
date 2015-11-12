/* 
 * File to contain all possible event constants
 * Will incorporate state-specific events soon
 * Need to come up with good system for them
 */

EVENTS = [];

EVENTS.push(new SomeEvent("At your destination, you see a scout group collecting donations for 5 dollars. Do you donate?",
        "One of the scouts thanks you dearly. (Lose 5 dollar)",
        "You continue on with your journey, keeping the money for yourself.",
        [new Modifier("money", -5), new Modifier("karma", 1)],
        []));

EVENTS.push(new SomeEvent("You find a 5 dollar bill in a parking lot at your destination. Do you take it for yourself?",
        "You put the money in your pocket. (Gain 5 dollars)",
        "You leave the money there, hoping that it will find its way back to its rightful owner. (No effects)",
        [new Modifier("money", 5), new Modifier("karma", -1)],
        []));

EVENTS.push(new SomeEvent("Your phone starts to ring while you're driving, and you notice that it's a good friend of yours calling. Do you answer?",
        "You are quickly pulled over by a police officer waiting on the road, and must pay a 10 dollar fine. (Lose 10 dollars)",
        "You wait until you arrive at your destination to call your friend back, and avoid breaking the law. (No effect)",
        [new Modifier("money", -10)],
        []));

EVENTS.push(new SomeEvent("You stop at a roadside grocery stand. You can buy 3 food for 5 dollars. Do you take the deal?",
        "You pay for the food, and get back on the road. (Lose 5 dollars) (Gain 3 food)",
        "You don't take the offer, and get back on the road. (No effects)",
        [new Modifier("money", -5), new Modifier("food", 3)],
        []));

EVENTS.push(new SomeEvent("You pull over to help a broken down vehicle on the side of the road. They're out of fuel, and ask you to loan them 2 fuel. Do help them?",
        "You lend them some fuel, and both get back on the road. (Lose 2 gas)",
        "You tell them you simply can't spare any fuel, and get back on the road. (No effects)",
        [new Modifier("gas", -2), new Modifier("karma", 2)],
        []));

EVENTS.push(new SomeEvent("As you get close to your destination, you see signs advertising the local circus. Do you take a small detour and attend?",
        "You decide to attend the circus. The ticket cost $5, but it was so much fun! (Lose 5 dollars)",
        "You decide that the cricus doesn't really sound that great. (No effects)",
        [new Modifier("money", -5), new Modifier("fun", 2)],
        []));

EVENTS.push(new SomeEvent("You pull up at a stop light and someone dressed as a taco knocks on your window. You roll it down and she offers you a free taco. Do you take it?",
        "You take the free taco. It's a free taco. Who wouldn't want a free taco? (Gain 1 food)",
        "You don't take the free taco. There's probably a reason it's free anyway... (No effects)",
        [new Modifier("food", 1)],
        []));

EVENTS.push(new SomeEvent("You arrive at your destination to see a man sitting at a streetside stand, whos wearing a suit and offering car insurance. It costs 10 dollars. Do you buy?",
        "You sign the contract without looking at the terms. Better sure hope this wasn't a scam.. (Lose 10 dollars)",
        "You don't sign the contract. He seemed pretty sketchy anyway. (No effects)",
        [new Modifier("money", -10)],
        []));
        
EVENTS.push(new SomeEvent("When you get to your destination, you see a souvenir shop, with a nice map of the USA in it for 5 dollars. Do you buy it?",
        "You buy the awesome map, and get it framed for later display. (Lose 5 dollars)",
        "You decide it's not worth the money, and continue on your trip. (No effects)",
        [new Modifier("money", -5)],
        []));
        
EVENTS.push(new SomeEvent("You arrive at your destination to see a bunch of men dressed as pirates outside a restaurant. Do you introduce yourself?",
        "You say hello, and begin to talk about your trip across the USA. One of the pirates says, 'Yarr matey, food and drinks on me tonight.' (Gain 3 food) (Gain 3 water)",
        "You aren't so sure you want to get near those guys just in case. You stay in your car until you're ready to leave. (No effects)",
        [new Modifier("food", 3), new Modifier("water", 3)],
        []));
        
EVENTS.push(new SomeEvent("You notice a candy factory upon arrival at your destination named Wally Wunka's Factory, offering tours for 5 dollars. Do you attend?",
        "You have an awesome time touring the candy factory, and get to take some candy home for yourself! (Lose 5 dollars) (Gain 5 food)",
        "You decide you've heard of this place before, and it doesn't seem like such a good idea. You skip the opportunity. (No effects)",
        [new Modifier("food", 5), new Modifier("money ", -5)],
        []));
        
EVENTS.push(new SomeEvent("You arrive near a car dealership advertising some super cool new ultrasmart cars. They're only 15 dollars. Do you buy one?",
        "As you go to put the key in the door to open the car, the entire car falls over. It's made of cardboard!!! The dealer refuses to give your money back (Lose 15 dollars)",
        "You like the car you have now, and refuse the offer. (No effects)",
        [new Modifier("money", -15)],
        []));
        
EVENTS.push(new SomeEvent("You see a man stealing an old lady's purse down the street. Do you rush to her aid?",
        "You run to help her, and as you do, Spider Man swoops in and helps save the day, shouting 'Nice going kid!",
        "You decide not to get invovled. It probably isn't a good idea anyway.",
        [new Modifier("karma", 3)],
        []));
        
EVENTS.push(new SomeEvent("You notice it's getting late. In a local ad, you find a deal at the Executive Suite at the Starstruck Inn, only 25 dollars a night. Do you stay?",
        "You have an awesome night, hanging out with a bunch of really fun people. (Lose 25 dollars)",
        "You decide that it's too expensive, and stay in an Overnight Value Inn instead. (Lose 2 dollars)",
        [new Modifier("money", -25)],
        [new Modifier("money", -2)]));
        
EVENTS.push(new SomeEvent("At your destination, a lady walks up to you offering to sponsor you in the local fashion competition for 5 dollars. Do you take the offer?",
        "After handing over the money, the lady quickly runs away with it, and is nowhere to be found. (Lose 5 dollars)",
        "You tell her you're not interested, and continue on your trip. You wonder if you could have won.. (No effects)",
        [new Modifier("money", -5)],
        []));
        
EVENTS.push(new SomeEvent("At your destination, a robot walks up to you and says '0101010011'. Do you reply with '0110011'?",
        "The robot seems offended, and walks away upset. (No effect)",
        "You instead reply with '01011001', and the robot beeps with affirmation, as his change slot opens, pouring out money. (Gain 20 dollars)",
        [],
        [new Modifier("money", 20)]));
        
EVENTS.push(new SomeEvent("A man walks up to you and says 'If you ever see a robot around here, make sure you say '01011001', not '0110011', okay?",
        "You tell him okay, and wonder where this robot is. (No effect)",
        "You look at the man as if he's crazy, and walk away. (No effect)",
        [],
        []));
        
EVENTS.push(new SomeEvent("You see a nice, shiny rock on the ground at your destination. Do you pick it up?",
        "As you go to pick the rock up, it opens its eyes and says, 'Hey there. I'm Rocky, your new best friend.' You put him on your dashboard and continue your adventure.",
        "You decide that the rock is probably best left alone. You get back into your car and continue driving. ",
        [new Modifier("karma", 1)],
        []));
        
EVENTS.push(new SomeEvent("At your destination, you see a sad looking kitten on the side of the road. Do you feed it?",
        "You give it some food and water. Afterwards, it jumps into the back seat of your car. I guess it's coming along then.. (Lose 2 food) (Lose 2 water)",
        "You simply can't spare and food or water. Sorry kitten... (No effects)",
        [new Modifier("karma", 1), new Modifier("food", -2), new Modifier("water", -2)],
        []));

// EVENTS.push(new SomeEvent("", "",
//         [new Modifier("food", 1)],
//         []));
MINIGAMES = [];
MINIGAMES.push(new MiniGame("Snowboarding", 'Snowboarding'));
MINIGAMES.push(new MiniGame("Rafting", 'Rafting'));
MINIGAMES.push(new MiniGame("Chicken Chasing", 'ChickenChasing'));


function SomeEvent(text, yestext, notext, yesmodifiers, nomodifiers) {
    this.text = text;
    this.yestext = yestext;
    this.notext = notext;
    this.yesmodifiers = yesmodifiers;
    this.nomodifiers = nomodifiers;
}


function Modifier(resource, amount) {
    this.resource = resource;
    this.amount = amount;
}

function MiniGame(name, stateName) {
    this.name = name;
    this.stateName = stateName;
}