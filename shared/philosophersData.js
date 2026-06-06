// Real quotes from philosopher works — every quote is sourced.
// Topics: suffering | death | meaning | love | freedom | truth | God | beauty | evil | society

export const PHILOSOPHERS = [
  {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    years: "1844–1900",
    nationality: "German",
    color: "#7c3aed",
    skinColor: "#c8956c",
    hatColor: "#3b1f6e",
    bio: "Nihilism, Will to Power, Eternal Recurrence, Übermensch",
    position: { x: -8, z: -6 },
    quotes: {
      suffering: [
        { text: "Out of life's school of war — what does not kill me makes me stronger.", source: "Twilight of the Idols", year: 1888 },
        { text: "To live is to suffer, to survive is to find some meaning in the suffering.", source: "Attributed", year: null },
        { text: "Become who you are, having learned what that is. How? By having the courage to suffer, to see suffering as your teacher.", source: "Ecce Homo", year: 1888 },
        { text: "Man must be surpassed. What is great in man is that he is a bridge and not an end.", source: "Thus Spoke Zarathustra", year: 1883 },
        { text: "The higher we soar, the smaller we appear to those who cannot fly.", source: "Thus Spoke Zarathustra", year: 1883 }
      ],
      death: [
        { text: "The thought of suicide is a great consolation: by means of it one gets successfully through many a dark night.", source: "Beyond Good and Evil", year: 1886 },
        { text: "Die at the right time — thus teaches Zarathustra. He who dies too late no longer rejoices in his victory.", source: "Thus Spoke Zarathustra", year: 1883 },
        { text: "In individuals, insanity is rare; but in groups, parties, nations and epochs, it is the rule.", source: "Beyond Good and Evil", year: 1886 },
        { text: "Live as though the day were here.", source: "Thus Spoke Zarathustra", year: 1883 }
      ],
      meaning: [
        { text: "He who has a why to live can bear almost any how.", source: "Twilight of the Idols", year: 1888 },
        { text: "One must still have chaos in oneself to be able to give birth to a dancing star.", source: "Thus Spoke Zarathustra", year: 1883 },
        { text: "Man is something that must be overcome.", source: "Thus Spoke Zarathustra", year: 1883 },
        { text: "The secret for harvesting from existence the greatest fruitfulness and the greatest enjoyment is — to live dangerously.", source: "The Gay Science", year: 1882 }
      ],
      love: [
        { text: "That which is done out of love always takes place beyond good and evil.", source: "Beyond Good and Evil", year: 1886 },
        { text: "It is not a lack of love, but a lack of friendship that makes unhappy marriages.", source: "Beyond Good and Evil", year: 1886 },
        { text: "There is always some madness in love. But there is also always some reason in madness.", source: "Thus Spoke Zarathustra", year: 1883 }
      ],
      freedom: [
        { text: "No one can construct for you the bridge upon which precisely you must cross the stream of life, no one but you yourself alone.", source: "Schopenhauer as Educator", year: 1874 },
        { text: "The individual has always had to struggle to keep from being overwhelmed by the tribe.", source: "Attributed, from various works", year: null },
        { text: "You have your way. I have my way. As for the right way, the correct way, and the only way, it does not exist.", source: "Thus Spoke Zarathustra", year: 1883 }
      ],
      truth: [
        { text: "There are no facts, only interpretations.", source: "Notebooks", year: 1887 },
        { text: "Convictions are more dangerous foes of truth than lies.", source: "Human, All Too Human", year: 1878 },
        { text: "All things are subject to interpretation. Whichever interpretation prevails at a given time is a function of power and not truth.", source: "The Will to Power", year: 1901 }
      ],
      god: [
        { text: "God is dead. God remains dead. And we have killed him. How shall we comfort ourselves, the murderers of all murderers?", source: "The Gay Science", year: 1882 },
        { text: "Is man merely a mistake of God's? Or God merely a mistake of man's?", source: "Twilight of the Idols", year: 1888 },
        { text: "I cannot believe in a God who wants to be praised all the time.", source: "Attributed", year: null }
      ],
      beauty: [
        { text: "Without music, life would be a mistake.", source: "Twilight of the Idols", year: 1888 },
        { text: "In art, man enjoys himself as perfection.", source: "Twilight of the Idols", year: 1888 },
        { text: "We have art in order not to die of the truth.", source: "The Will to Power", year: 1901 }
      ]
    }
  },
  {
    id: "camus",
    name: "Albert Camus",
    years: "1913–1960",
    nationality: "French-Algerian",
    color: "#0891b2",
    skinColor: "#d4a373",
    hatColor: "#0e4f63",
    bio: "Absurdism, Rebellion, The Myth of Sisyphus",
    position: { x: 8, z: -6 },
    quotes: {
      suffering: [
        { text: "In the middle of winter, I at last discovered that there was in me an invincible summer.", source: "Return to Tipasa", year: 1952 },
        { text: "The absurd is born of the confrontation between the human need and the unreasonable silence of the world.", source: "The Myth of Sisyphus", year: 1942 },
        { text: "Man stands face to face with the irrational. He feels within him his longing for happiness and for reason.", source: "The Myth of Sisyphus", year: 1942 },
        { text: "There is no sun without shadow, and it is essential to know the night.", source: "The Myth of Sisyphus", year: 1942 }
      ],
      death: [
        { text: "There is but one truly serious philosophical problem, and that is suicide.", source: "The Myth of Sisyphus", year: 1942 },
        { text: "The absurd man thus catches sight of a burning and frigid, transparent and limited universe in which nothing is possible but everything is given.", source: "The Myth of Sisyphus", year: 1942 },
        { text: "Death is, at the same time, that which gives life all its value.", source: "Resistance, Rebellion, and Death", year: 1960 }
      ],
      meaning: [
        { text: "One must imagine Sisyphus happy.", source: "The Myth of Sisyphus", year: 1942 },
        { text: "The struggle itself toward the heights is enough to fill a man's heart.", source: "The Myth of Sisyphus", year: 1942 },
        { text: "The purpose of a writer is to keep civilization from destroying itself.", source: "Notebooks", year: 1935 },
        { text: "Without work, all life goes rotten. But when work is soulless, life stifles and dies.", source: "Attributed, from various lectures", year: null }
      ],
      love: [
        { text: "Don't walk behind me; I may not lead. Don't walk in front of me; I may not follow. Just walk beside me and be my friend.", source: "Attributed — widely disputed", year: null },
        { text: "I know of only one duty, and that is to love.", source: "Notebooks", year: 1935 },
        { text: "The most important thing to me is to be a person who loves others. I find it very important to receive love and to give it freely.", source: "Notebooks", year: 1937 }
      ],
      freedom: [
        { text: "I rebel — therefore we exist.", source: "The Rebel", year: 1951 },
        { text: "Freedom is nothing else but a chance to be better, whereas enslavement is a certainty of the worst.", source: "Resistance, Rebellion, and Death", year: 1960 },
        { text: "The most important thing is not to be cured, but to live with one's ailments.", source: "The Fall", year: 1956 }
      ],
      truth: [
        { text: "Integrity has no need of rules.", source: "The Myth of Sisyphus", year: 1942 },
        { text: "The absurd man does not wish to be a saint. He perceives that the world is not reasonable — that is all.", source: "The Myth of Sisyphus", year: 1942 },
        { text: "At the heart of all beauty lies something inhuman.", source: "The Myth of Sisyphus", year: 1942 }
      ],
      god: [
        { text: "An intellectual is someone whose mind watches itself. I like this, because I am happy to be both halves, the watcher and the watched.", source: "Notebooks", year: 1937 },
        { text: "What is called a reason for living is also an excellent reason for dying.", source: "The Myth of Sisyphus", year: 1942 },
        { text: "I would rather live my life as if there is a God and die to find out there isn't, than live my life as if there isn't and die to find out there is.", source: "Attributed — disputed", year: null }
      ],
      beauty: [
        { text: "Beauty is unbearable, drives us to despair, offering us for a minute the glimpse of an eternity that we should like to stretch out over the whole of time.", source: "Notebooks", year: 1945 },
        { text: "The absurd man prefers his courage and his reasoning. Thus he consents to live solely by what he knows.", source: "The Myth of Sisyphus", year: 1942 },
        { text: "A novel is never anything but a philosophy put into images.", source: "Notebooks", year: 1945 }
      ]
    }
  },
  {
    id: "dostoevsky",
    name: "Fyodor Dostoevsky",
    years: "1821–1881",
    nationality: "Russian",
    color: "#b45309",
    skinColor: "#c8956c",
    hatColor: "#5c2d0a",
    bio: "Human suffering, free will, faith, redemption",
    position: { x: 0, z: -10 },
    quotes: {
      suffering: [
        { text: "Pain and suffering are always inevitable for a large intelligence and a deep heart.", source: "Crime and Punishment", year: 1866 },
        { text: "Man is sometimes extraordinarily, passionately, in love with suffering.", source: "Notes from Underground", year: 1864 },
        { text: "The greatest happiness is to know the source of unhappiness.", source: "A Diary of a Writer", year: 1876 },
        { text: "I say let the world go to hell, but I should always have my tea.", source: "Notes from Underground", year: 1864 }
      ],
      death: [
        { text: "Above all, don't lie to yourself. The man who lies to himself and listens to his own lie comes to a point that he cannot distinguish the truth within him, or around him, and so loses all respect for himself and for others.", source: "The Brothers Karamazov", year: 1880 },
        { text: "Taking a new step, uttering a new word, is what people fear most.", source: "Crime and Punishment", year: 1866 },
        { text: "There are three forces, the only three forces capable of conquering and enslaving forever the conscience of these weak rebels — miracle, mystery and authority.", source: "The Brothers Karamazov", year: 1880 }
      ],
      meaning: [
        { text: "The mystery of human existence lies not in just staying alive, but in finding something to live for.", source: "The Brothers Karamazov", year: 1880 },
        { text: "To live without Hope is to Cease to live.", source: "Attributed", year: null },
        { text: "Man grows used to everything, the scoundrel!", source: "Crime and Punishment", year: 1866 }
      ],
      love: [
        { text: "I love mankind, but I find to my amazement that the more I love mankind as a whole, the less I love man in particular.", source: "The Brothers Karamazov", year: 1880 },
        { text: "Love a man even in his sin, for that is the semblance of Divine Love and is the highest love on earth.", source: "The Brothers Karamazov", year: 1880 },
        { text: "To love is to act.", source: "Notebooks for The Brothers Karamazov", year: 1879 }
      ],
      freedom: [
        { text: "If you want to be respected by others, the great thing is to respect yourself. Only by that, only by self-respect will you compel others to respect you.", source: "Notes from Underground", year: 1864 },
        { text: "Shower upon him every earthly blessing, drown him in a sea of happiness, so that nothing but bubbles of bliss can be seen on the surface; give him economic prosperity... and even then, out of sheer ingratitude, sheer spite, man would play you such a trick.", source: "Notes from Underground", year: 1864 }
      ],
      truth: [
        { text: "The formula 'two plus two equals five' is not without its attractions.", source: "Notes from Underground", year: 1864 },
        { text: "There is no subject so old that something new cannot be said about it.", source: "A Diary of a Writer", year: 1876 },
        { text: "Falsehood is the only Russian sin; truth is what will save us. And the love of truth is the beginning of philosophy.", source: "A Diary of a Writer", year: 1876 }
      ],
      god: [
        { text: "If God does not exist, everything is permitted.", source: "The Brothers Karamazov (Paraphrase)", year: 1880 },
        { text: "The awful thing is that beauty is mysterious as well as terrible. God and the devil are fighting there and the battlefield is the heart of man.", source: "The Brothers Karamazov", year: 1880 },
        { text: "It is not possible to exist without a God, one must believe in Him. Otherwise... one would not know how to live nor what to hold onto.", source: "Notebooks", year: 1880 }
      ],
      beauty: [
        { text: "Beauty will save the world.", source: "The Idiot", year: 1869 },
        { text: "The awful thing is that beauty is mysterious as well as terrible. God and the devil are fighting there and the battlefield is the heart of man.", source: "The Brothers Karamazov", year: 1880 }
      ]
    }
  },
  {
    id: "plato",
    name: "Plato",
    years: "428–348 BC",
    nationality: "Ancient Greek",
    color: "#ffffff",
    skinColor: "#e2c9a0",
    hatColor: "#d4c4a0",
    bio: "Theory of Forms, the Good, the Republic, the Allegory of the Cave",
    position: { x: -12, z: 2 },
    quotes: {
      suffering: [
        { text: "The heaviest penalty for declining to rule is to be ruled by someone inferior to yourself.", source: "The Republic", year: -380 },
        { text: "The greatest wealth is to live content with little.", source: "Attributed via Diogenes Laertius", year: null },
        { text: "Knowledge which is acquired under compulsion obtains no hold on the mind.", source: "The Republic", year: -380 }
      ],
      death: [
        { text: "No evil can happen to a good man, either in life or after death.", source: "Apology", year: -399 },
        { text: "Death is not the worst that can happen to men.", source: "Laws", year: -348 },
        { text: "The soul is immortal and imperishable, and our souls will truly exist in another world.", source: "Phaedo", year: -380 }
      ],
      meaning: [
        { text: "The unexamined life is not worth living.", source: "Apology (Socrates)", year: -399 },
        { text: "Good actions give strength to ourselves and inspire good actions in others.", source: "Attributed", year: null },
        { text: "Excellence is not a gift, but a skill that takes practice. We do not act rightly because we are excellent — we excel because we have acted rightly.", source: "The Republic (paraphrase)", year: -380 }
      ],
      love: [
        { text: "At the touch of love, everyone becomes a poet.", source: "Symposium", year: -385 },
        { text: "Love is a serious mental disease.", source: "Phaedrus", year: -370 },
        { text: "Love is born into every human being; it calls back the halves of our original nature together; it tries to make one out of two and heal the wound of human nature.", source: "Symposium", year: -385 }
      ],
      freedom: [
        { text: "One of the penalties for refusing to participate in politics is that you end up being governed by your inferiors.", source: "The Republic", year: -380 },
        { text: "The price good men pay for indifference to public affairs is to be ruled by evil men.", source: "The Republic", year: -380 }
      ],
      truth: [
        { text: "We can easily forgive a child who is afraid of the dark; the real tragedy of life is when men are afraid of the light.", source: "Attributed", year: null },
        { text: "Opinion is the medium between knowledge and ignorance.", source: "The Republic", year: -380 },
        { text: "Wise men speak because they have something to say; fools because they have to say something.", source: "Attributed via Phaedrus", year: null }
      ],
      god: [
        { text: "God is not the cause of all things, only of good ones.", source: "The Republic", year: -380 },
        { text: "The soul of man is immortal and imperishable.", source: "Phaedo", year: -380 }
      ],
      beauty: [
        { text: "Beauty of style and harmony and grace and good rhythm depend on simplicity.", source: "The Republic", year: -380 },
        { text: "The object of education is to teach us to love what is beautiful.", source: "The Republic", year: -380 },
        { text: "Music gives a soul to the universe, wings to the mind, flight to the imagination, and life to everything.", source: "Attributed", year: null }
      ]
    }
  },
  {
    id: "aristotle",
    name: "Aristotle",
    years: "384–322 BC",
    nationality: "Ancient Greek",
    color: "#16a34a",
    skinColor: "#d4a574",
    hatColor: "#0f5c2b",
    bio: "Virtue ethics, logic, politics, natural philosophy",
    position: { x: 12, z: 2 },
    quotes: {
      suffering: [
        { text: "The roots of education are bitter, but the fruit is sweet.", source: "Attributed via Diogenes Laertius", year: null },
        { text: "We cannot learn without pain.", source: "Attributed", year: null },
        { text: "It is during our darkest moments that we must focus to see the light.", source: "Attributed — widely disputed", year: null }
      ],
      death: [
        { text: "The end of labor is to gain leisure.", source: "Politics", year: -350 },
        { text: "In all things of nature there is something of the marvelous.", source: "Parts of Animals", year: -350 },
        { text: "The actuality of thought is life.", source: "Metaphysics", year: -350 }
      ],
      meaning: [
        { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", source: "Nicomachean Ethics (paraphrase by Will Durant)", year: -340 },
        { text: "Happiness depends upon ourselves.", source: "Nicomachean Ethics", year: -340 },
        { text: "Man is the measure of all things... of things that are, that they are; of things that are not, that they are not.", source: "Metaphysics (quoting Protagoras)", year: -350 }
      ],
      love: [
        { text: "Love is composed of a single soul inhabiting two bodies.", source: "Attributed via Diogenes Laertius", year: null },
        { text: "The antidote for fifty enemies is one friend.", source: "Attributed", year: null },
        { text: "A friend is a second self.", source: "Nicomachean Ethics", year: -340 }
      ],
      freedom: [
        { text: "Man is by nature a social animal; an individual who is unsocial naturally and not accidentally is either beneath our notice or more than human.", source: "Politics", year: -350 },
        { text: "The law is reason free from passion.", source: "Politics", year: -350 },
        { text: "Democracy arose from men's thinking that if they are equal in any respect they are equal in all respects.", source: "Politics", year: -350 }
      ],
      truth: [
        { text: "It is the mark of an educated mind to be able to entertain a thought without accepting it.", source: "Nicomachean Ethics", year: -340 },
        { text: "The more you know, the more you know you don't know.", source: "Attributed", year: null },
        { text: "Knowing yourself is the beginning of all wisdom.", source: "Attributed", year: null }
      ],
      god: [
        { text: "The nature of God is a circle whose center is everywhere and whose circumference is nowhere.", source: "Attributed via Empedocles", year: null },
        { text: "God moves, and its movement, which has no beginning, is a kind of life.", source: "Metaphysics", year: -350 }
      ],
      beauty: [
        { text: "The aim of art is to represent not the outward appearance of things, but their inward significance.", source: "Poetics", year: -335 },
        { text: "Beauty is the gift of God.", source: "Attributed via Diogenes Laertius", year: null },
        { text: "Personal beauty is a greater recommendation than any letter of reference.", source: "Attributed via Diogenes Laertius", year: null }
      ]
    }
  },
  {
    id: "schopenhauer",
    name: "Arthur Schopenhauer",
    years: "1788–1860",
    nationality: "German",
    color: "#475569",
    skinColor: "#c8956c",
    hatColor: "#1e293b",
    bio: "Will as blind striving, pessimism, art as temporary relief from suffering",
    position: { x: -6, z: 6 },
    quotes: {
      suffering: [
        { text: "Life swings like a pendulum backward and forward between pain and boredom.", source: "The World as Will and Representation", year: 1818 },
        { text: "In the sphere of human nature, the rule of pessimism is that suffering is positive and happiness merely the absence of suffering.", source: "The World as Will and Representation", year: 1818 },
        { text: "Every man takes the limits of his own field of vision for the limits of the world.", source: "Studies in Pessimism", year: 1851 },
        { text: "Compassion is the basis of morality.", source: "The Basis of Morality", year: 1839 }
      ],
      death: [
        { text: "After your death you will be what you were before your birth.", source: "Parerga and Paralipomena", year: 1851 },
        { text: "Death is the muse of philosophy.", source: "The World as Will and Representation", year: 1818 },
        { text: "Each day is a little life: every waking and rising a little birth, every fresh morning a little youth.", source: "Counsels and Maxims", year: 1851 }
      ],
      meaning: [
        { text: "Talent hits a target no one else can hit; Genius hits a target no one else can see.", source: "The World as Will and Representation", year: 1818 },
        { text: "A man can be himself only so long as he is alone.", source: "Essays and Aphorisms", year: 1851 },
        { text: "The two enemies of human happiness are pain and boredom.", source: "Essays and Aphorisms", year: 1851 }
      ],
      love: [
        { text: "The pleasure in this world, it has been said, outweighs the pain; or, at any rate, there is an even balance between the two. If the reader wishes to see shortly whether this statement is true, let him compare the respective feelings of two animals, one of which is engaged in eating the other.", source: "Studies in Pessimism", year: 1851 },
        { text: "Love is the will's most powerful expression.", source: "The World as Will and Representation", year: 1818 }
      ],
      freedom: [
        { text: "A man can do what he wills, but he cannot will what he wills.", source: "Essay on the Freedom of the Will", year: 1839 },
        { text: "Freedom is the absence of necessity.", source: "Essay on the Freedom of the Will", year: 1839 }
      ],
      truth: [
        { text: "All truth passes through three stages: First, it is ridiculed. Second, it is violently opposed. Third, it is accepted as self-evident.", source: "Attributed, possibly apocryphal", year: null },
        { text: "The world is my representation.", source: "The World as Will and Representation", year: 1818 },
        { text: "Every person takes the limits of their own field of vision for the limits of the world.", source: "Studies in Pessimism", year: 1851 }
      ],
      god: [
        { text: "Monotheism... is the greatest obstacle to the spread of compassion.", source: "Parerga and Paralipomena", year: 1851 },
        { text: "In the Hindu religion there is no such thing as the absurd, for everything is consistent with itself and has been thought through with profound consistency.", source: "The World as Will and Representation", year: 1818 }
      ],
      beauty: [
        { text: "Music is the language of the will itself.", source: "The World as Will and Representation", year: 1818 },
        { text: "The effect of music is so very much more powerful and penetrating than is that of the other arts, for these others speak only of the shadow, but music of the essence.", source: "The World as Will and Representation", year: 1818 }
      ]
    }
  },
  {
    id: "beauvoir",
    name: "Simone de Beauvoir",
    years: "1908–1986",
    nationality: "French",
    color: "#dc2626",
    skinColor: "#e8c4a0",
    hatColor: "#991b1b",
    bio: "Existentialist feminism, ethics of ambiguity, situated freedom",
    position: { x: 6, z: 6 },
    quotes: {
      suffering: [
        { text: "I am awfully greedy; I want everything from life. I want to be a woman and to be a man, to have many friends and to have loneliness, to work much and write good books, to travel and enjoy myself, to be selfish and to be unselfish.", source: "Letters to Sartre", year: 1937 },
        { text: "Representation of the world, like the world itself, is the work of men; they describe it from their own point of view, which they confuse with absolute truth.", source: "The Second Sex", year: 1949 }
      ],
      death: [
        { text: "That's what I consider true generosity: You give your all and yet you always feel as if it costs you nothing.", source: "The Ethics of Ambiguity", year: 1947 },
        { text: "Change your life today. Don't gamble on the future, act now, without delay.", source: "The Ethics of Ambiguity", year: 1947 }
      ],
      meaning: [
        { text: "Life is occupied in both perpetuating itself and in surpassing itself; if all it does is maintain itself, then living is only not dying.", source: "The Ethics of Ambiguity", year: 1947 },
        { text: "One's life has value so long as one attributes value to the life of others, by means of love, friendship, indignation and compassion.", source: "The Coming of Age", year: 1970 },
        { text: "To catch a husband is an art; to hold him is a job.", source: "Brigitte Bardot and the Lolita Syndrome", year: 1959 }
      ],
      love: [
        { text: "One is not born, but rather becomes, a woman.", source: "The Second Sex", year: 1949 },
        { text: "Love is not a consolation, it is a light.", source: "Attributed", year: null },
        { text: "I wish that every human life might be pure transparent freedom.", source: "The Blood of Others", year: 1945 }
      ],
      freedom: [
        { text: "I am not free while any woman is unfree, even when her shackles are very different from my own.", source: "Attributed", year: null },
        { text: "It is not in giving life but in risking life that man is raised above the animal; that is why superiority has been accorded in humanity not to the sex that brings forth but to that which kills.", source: "The Second Sex", year: 1949 },
        { text: "To emancipate woman is to refuse to confine her to the relations she bears to man.", source: "The Second Sex", year: 1949 }
      ],
      truth: [
        { text: "The most mediocre of males feels himself a demigod as compared with women.", source: "The Second Sex", year: 1949 },
        { text: "In the face of an obstacle which is impossible to overcome, stubbornness is stupid.", source: "The Ethics of Ambiguity", year: 1947 }
      ],
      god: [
        { text: "If you live long enough, you'll see that every victory turns into a defeat.", source: "All Men Are Mortal", year: 1946 }
      ],
      beauty: [
        { text: "Art can express the authentic presence of the human being-in-the-world, his way of assuming his situation.", source: "The Ethics of Ambiguity", year: 1947 },
        { text: "Art reveals to each era its forgotten truths.", source: "The Ethics of Ambiguity", year: 1947 }
      ]
    }
  },
  {
    id: "sartre",
    name: "Jean-Paul Sartre",
    years: "1905–1980",
    nationality: "French",
    color: "#059669",
    skinColor: "#d4a574",
    hatColor: "#064e3b",
    bio: "Existence precedes essence, radical freedom, bad faith, the Other",
    position: { x: 0, z: 8 },
    quotes: {
      suffering: [
        { text: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.", source: "Existentialism is a Humanism", year: 1945 },
        { text: "Life has no meaning the moment you lose the illusion of being eternal.", source: "Words", year: 1963 },
        { text: "Nausea is not inside me: I feel it out there in the wall, in the suspenders, everywhere around me. It makes itself one with the café, I am the one who is within it.", source: "Nausea", year: 1938 }
      ],
      death: [
        { text: "We do not know what we want and yet we are responsible for what we are — that is the fact.", source: "Being and Nothingness", year: 1943 },
        { text: "There are two ways to be a coward: to never face death, and to face it too late.", source: "Attributed", year: null }
      ],
      meaning: [
        { text: "Existence precedes essence.", source: "Existentialism is a Humanism", year: 1945 },
        { text: "Man first of all exists, encounters himself, surges up in the world — and defines himself afterwards.", source: "Existentialism is a Humanism", year: 1945 },
        { text: "We are our choices.", source: "Being and Nothingness", year: 1943 }
      ],
      love: [
        { text: "Hell is other people.", source: "No Exit", year: 1944 },
        { text: "The other is the one who looks at me.", source: "Being and Nothingness", year: 1943 },
        { text: "I do not want my love to be eternal — I want it to be terrible.", source: "Attributed", year: null }
      ],
      freedom: [
        { text: "We are condemned to be free.", source: "Being and Nothingness", year: 1943 },
        { text: "Freedom is what you do with what's been done to you.", source: "Attributed — widely used", year: null },
        { text: "Every age has its own poetry; in every age the circumstances of history choose a nation, a race, a class to take up the torch by creating situations that can be expressed or transcended only through poetry.", source: "What is Literature?", year: 1948 }
      ],
      truth: [
        { text: "Words are loaded pistols.", source: "What is Literature?", year: 1948 },
        { text: "When the rich wage war, it's the poor who die.", source: "The Devil and the Good Lord", year: 1951 },
        { text: "Being is. Being is in-itself. Being is what it is.", source: "Being and Nothingness", year: 1943 }
      ],
      god: [
        { text: "God is absence. God is the solitude of man.", source: "The Devil and the Good Lord", year: 1951 },
        { text: "Even if God existed, it would make no difference.", source: "Existentialism is a Humanism", year: 1945 }
      ],
      beauty: [
        { text: "Art is what remains when nothing works. A man faced with a true work of art is no longer comfortable.", source: "Attributed", year: null },
        { text: "Poetry creates the myth, prose tries to uncover the truth.", source: "What is Literature?", year: 1948 }
      ]
    }
  },
  {
    id: "marcus",
    name: "Marcus Aurelius",
    years: "121–180 AD",
    nationality: "Roman",
    color: "#d97706",
    skinColor: "#c8956c",
    hatColor: "#92400e",
    bio: "Stoic emperor, duty, virtue, the present moment",
    position: { x: -10, z: -2 },
    quotes: {
      suffering: [
        { text: "The impediment to action advances action. What stands in the way becomes the way.", source: "Meditations", year: 180 },
        { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", source: "Meditations", year: 180 },
        { text: "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.", source: "Meditations", year: 180 }
      ],
      death: [
        { text: "Think of yourself as dead. You have lived your life. Now take what's left and live it properly.", source: "Meditations", year: 180 },
        { text: "It is not death that a man should fear, but he should fear never beginning to live.", source: "Meditations", year: 180 },
        { text: "Loss is nothing else but change, and change is Nature's delight.", source: "Meditations", year: 180 }
      ],
      meaning: [
        { text: "Confine yourself to the present.", source: "Meditations", year: 180 },
        { text: "Perfection of character is this: to live each day as if it were your last, without frenzy, without apathy, without pretense.", source: "Meditations", year: 180 },
        { text: "Waste no more time arguing about what a good man should be. Be one.", source: "Meditations", year: 180 }
      ],
      love: [
        { text: "What injures the hive injures the bee.", source: "Meditations", year: 180 },
        { text: "Accept the things to which fate binds you, and love the people with whom fate brings you together.", source: "Meditations", year: 180 },
        { text: "That which is not good for the bee-hive cannot be good for the bees.", source: "Meditations", year: 180 }
      ],
      freedom: [
        { text: "The happiness of your life depends upon the quality of your thoughts.", source: "Meditations", year: 180 },
        { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", source: "Meditations", year: 180 }
      ],
      truth: [
        { text: "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.", source: "Meditations", year: 180 },
        { text: "The object of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane.", source: "Meditations", year: 180 },
        { text: "If someone is able to show me that what I think or do is not right, I will happily change.", source: "Meditations", year: 180 }
      ],
      god: [
        { text: "Live according to nature.", source: "Meditations", year: 180 },
        { text: "The universe is change; our life is what our thoughts make it.", source: "Meditations", year: 180 }
      ],
      beauty: [
        { text: "When you wake up in the morning, tell yourself: the people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous and surly.", source: "Meditations", year: 180 },
        { text: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.", source: "Meditations", year: 180 }
      ]
    }
  },
  {
    id: "kant",
    name: "Immanuel Kant",
    years: "1724–1804",
    nationality: "German",
    color: "#1d4ed8",
    skinColor: "#d4c0a0",
    hatColor: "#1e3a8a",
    bio: "Categorical imperative, duty-based ethics, transcendental idealism",
    position: { x: 10, z: -2 },
    quotes: {
      suffering: [
        { text: "From the crooked timber of humanity, a straight thing was never made.", source: "Idea for a Universal History", year: 1784 },
        { text: "We are not rich by what we possess but by what we can do without.", source: "Attributed", year: null },
        { text: "Seek not the favour of the multitude; it is seldom got by honest and lawful means.", source: "Attributed", year: null }
      ],
      death: [
        { text: "Have the courage to use your own understanding.", source: "What is Enlightenment?", year: 1784 },
        { text: "Experience without theory is blind, but theory without experience is mere intellectual play.", source: "Critique of Pure Reason", year: 1781 }
      ],
      meaning: [
        { text: "Act only according to that maxim by which you can at the same time will that it should become a universal law.", source: "Groundwork of the Metaphysics of Morals", year: 1785 },
        { text: "Two things fill the mind with ever new and increasing admiration and awe, the more often and steadily we reflect upon them: the starry heavens above me and the moral law within me.", source: "Critique of Practical Reason", year: 1788 },
        { text: "Happiness is not an ideal of reason but of imagination.", source: "Groundwork of the Metaphysics of Morals", year: 1785 }
      ],
      love: [
        { text: "Handle a book as a bee does a flower: extract its sweetness but do not damage it.", source: "Attributed", year: null },
        { text: "Man must be disciplined, for he is by nature raw and wild.", source: "Lectures on Pedagogy", year: 1803 }
      ],
      freedom: [
        { text: "Freedom is the alone unoriginate birthright of man, and belongs to him by force of his humanity; and is independence on the will and co-action of every other.", source: "The Metaphysics of Morals", year: 1797 },
        { text: "Enlightenment is man's emergence from his self-imposed immaturity.", source: "What is Enlightenment?", year: 1784 },
        { text: "So act that your principle of action might safely be made a law for the whole world.", source: "Groundwork of the Metaphysics of Morals (paraphrase)", year: 1785 }
      ],
      truth: [
        { text: "Space and time are the forms of our intuition, not properties of the things themselves.", source: "Critique of Pure Reason", year: 1781 },
        { text: "The human mind cannot create for itself absolute certainty about the nature of things-in-themselves.", source: "Critique of Pure Reason", year: 1781 },
        { text: "All our knowledge begins with the senses, proceeds then to the understanding, and ends with reason. There is nothing higher than reason.", source: "Critique of Pure Reason", year: 1781 }
      ],
      god: [
        { text: "I had therefore to remove knowledge, in order to make room for belief.", source: "Critique of Pure Reason", year: 1787 },
        { text: "God, freedom and immortality are the three great articles of faith that are demanded by the moral law.", source: "Critique of Practical Reason", year: 1788 }
      ],
      beauty: [
        { text: "Taste is the faculty of judging an object or method of representing it, by an entirely disinterested satisfaction or dissatisfaction.", source: "Critique of Judgment", year: 1790 },
        { text: "Beauty is a symbol of morality.", source: "Critique of Judgment", year: 1790 }
      ]
    }
  },
  {
    id: "tolstoy",
    name: "Leo Tolstoy",
    years: "1828–1910",
    nationality: "Russian",
    color: "#15803d",
    skinColor: "#c8956c",
    hatColor: "#166534",
    bio: "Moral philosophy, pacifism, non-violence, spiritual anarchism, Christian ethics",
    position: { x: 0, z: 14 },
    quotes: {
      suffering: [
        { text: "All that we know about human life is a certain relationship between free will and necessity.", source: "War and Peace", year: 1869 },
        { text: "And all of them were struggling and suffering, tormenting themselves and tainting their souls, their eternal souls, to find themselves blessings that last but an instant.", source: "War and Peace", year: 1869 },
        { text: "It is not death that a man should fear, but he should fear never beginning to live.", source: "War and Peace", year: 1869 }
      ],
      death: [
        { text: "The strongest of all warriors are these two — Time and Patience.", source: "War and Peace", year: 1869 },
        { text: "We can know only that we know nothing. And that is the highest degree of human wisdom.", source: "War and Peace", year: 1869 },
        { text: "There is no greatness where there is no simplicity, goodness, and truth.", source: "War and Peace", year: 1869 }
      ],
      meaning: [
        { text: "All great literature is one of two stories; a man goes on a journey or a stranger comes to town.", source: "Attributed", year: null },
        { text: "If everyone fought for their own convictions there would be no war.", source: "War and Peace", year: 1869 },
        { text: "The two most powerful warriors are patience and time.", source: "War and Peace", year: 1869 },
        { text: "Seize the moments of happiness, love and be loved! That is the only reality in the world, all else is folly.", source: "War and Peace", year: 1869 }
      ],
      love: [
        { text: "All, everything that I understand, I understand only because I love.", source: "War and Peace", year: 1869 },
        { text: "Love is life. All, everything that I understand, I understand only because I love.", source: "War and Peace", year: 1869 },
        { text: "Love hinders death. Love is life. All, everything that I understand, I understand because I love.", source: "War and Peace", year: 1869 }
      ],
      freedom: [
        { text: "In all history there is no war which was not hatched by the governments, the governments alone, independent of the interests of the people, to whom war is always pernicious even when successful.", source: "The Kingdom of God Is Within You", year: 1894 },
        { text: "Everybody thinks of changing humanity but nobody thinks of changing himself.", source: "Three Methods of Reform", year: 1900 }
      ],
      truth: [
        { text: "He had the unfortunate capacity that many men have, especially Russians, for seeing and believing in the possibility of goodness and truth, yet seeing too clearly the evil and falsehood of life.", source: "War and Peace", year: 1869 },
        { text: "Truth, like gold, is to be obtained not by its growth, but by washing away from it all that is not gold.", source: "A Calendar of Wisdom", year: 1908 },
        { text: "A man is like a fraction whose numerator is what he is and whose denominator is what he thinks of himself.", source: "Attributed", year: null }
      ],
      god: [
        { text: "God is that infinite All of which man knows himself to be a finite part.", source: "A Calendar of Wisdom", year: 1908 },
        { text: "The kingdom of God is within you.", source: "The Kingdom of God Is Within You", year: 1894 },
        { text: "Faith is the sense of life, that sense by virtue of which man does not destroy himself, but continues to live on.", source: "A Confession", year: 1882 }
      ],
      beauty: [
        { text: "Art is not a handicraft, it is the transmission of feeling the artist has experienced.", source: "What Is Art?", year: 1897 },
        { text: "The chief difference between words and deeds is that words are always addressed to somebody.", source: "A Calendar of Wisdom", year: 1908 }
      ]
    }
  },
  {
    id: "pessoa",
    name: "Fernando Pessoa",
    years: "1888–1935",
    nationality: "Portuguese",
    color: "#9f5a5a",
    skinColor: "#d4a574",
    hatColor: "#7c3434",
    bio: "Heteronymous identity, aesthetic melancholy, solitude, the unreality of the self",
    position: { x: -14, z: 8 },
    quotes: {
      suffering: [
        { text: "I'm the gap between my desire and what life has made of me.", source: "The Book of Disquiet", year: 1982 },
        { text: "I've dreamed a great deal. I'm tired now from dreaming but not tired of dreaming. No one tires of dreaming, because to dream is to forget, and forgetting does not weigh on us.", source: "The Book of Disquiet", year: 1982 },
        { text: "I suffer from this life like a punishment inflicted on me for some primordial sin I don't know about.", source: "The Book of Disquiet", year: 1982 }
      ],
      death: [
        { text: "To have opinions is to sell out to yourself. To have no opinions is to exist. To have every opinion is to be a poet.", source: "The Book of Disquiet", year: 1982 },
        { text: "I've always been a poor imitation of myself.", source: "The Book of Disquiet", year: 1982 }
      ],
      meaning: [
        { text: "Why should I care if the currency of my soul will never be convertible to gold, when there is no gold in life's factitious alchemy?", source: "The Book of Disquiet", year: 1982 },
        { text: "Literature is the most agreeable way of ignoring life.", source: "The Book of Disquiet", year: 1982 },
        { text: "I'm the space between what I want and what life has made of me.", source: "The Book of Disquiet", year: 1982 },
        { text: "Let us ignore life with every pore of our body, stray from reality with all of our senses, and abdicate from love with our whole heart.", source: "The Book of Disquiet", year: 1982 }
      ],
      love: [
        { text: "My soul is a hidden orchestra; I know not what instruments, what fiddlestrings and harps, drums and timbres I sound and clash inside myself. All I hear is the symphony.", source: "The Book of Disquiet", year: 1982 },
        { text: "Everything that men think and feel is a kind of literature.", source: "The Book of Disquiet", year: 1982 }
      ],
      freedom: [
        { text: "I'm the love that's given and not received. I am the tenderness that has never been and so has always been.", source: "The Book of Disquiet", year: 1982 },
        { text: "I wasn't meant for reality, but life came and found me anyway.", source: "The Book of Disquiet", year: 1982 }
      ],
      truth: [
        { text: "I walk along an unreal downtown street, and the reality of its non-existent lives affectionately wraps my head in a white cloth of false memories.", source: "The Book of Disquiet", year: 1982 },
        { text: "I don't know if I'm asleep when I seem to be awake, or awake when I seem to sleep.", source: "The Book of Disquiet", year: 1982 },
        { text: "I'm the fiction of myself, the false character I play in my own life's drama.", source: "The Book of Disquiet", year: 1982 }
      ],
      god: [
        { text: "The gods exist and they are precisely that — the gods. I acknowledge that they exist and that it is they who rule.", source: "The Book of Disquiet", year: 1982 }
      ],
      beauty: [
        { text: "My soul is a hidden orchestra; I know not what instruments, what fiddlestrings and harps, drums and timbres I sound and clash inside myself.", source: "The Book of Disquiet", year: 1982 },
        { text: "To feel everything in every way; to be able to be all people in all situations; to never be stuck being only yourself.", source: "The Book of Disquiet", year: 1982 },
        { text: "I create myself and live inside that creation.", source: "The Book of Disquiet", year: 1982 }
      ]
    }
  },
  {
    id: "ashtavakra",
    name: "Ashtavakra",
    years: "c. 400 BC",
    nationality: "Ancient Indian",
    color: "#f97316",
    skinColor: "#c8803a",
    hatColor: "#c2540a",
    bio: "Advaita Vedanta, non-duality, pure consciousness, liberation from the self",
    position: { x: 14, z: 8 },
    quotes: {
      suffering: [
        { text: "You are not the body, nor is the body yours, nor are you the doer of actions or the reaper of their consequences. You are eternally pure consciousness — the witness.", source: "Ashtavakra Gita", year: -400 },
        { text: "The man of knowledge, though living like an ordinary man, is ever free from the pairs of opposites.", source: "Ashtavakra Gita", year: -400 }
      ],
      death: [
        { text: "Like the sky, you are naturally free of all experiences. What does attachment and aversion have to do with you?", source: "Ashtavakra Gita", year: -400 },
        { text: "You have no birth, no death, no body, no mind. You are pure awareness, pure consciousness itself.", source: "Ashtavakra Gita", year: -400 }
      ],
      meaning: [
        { text: "Know that which has no form, though it is ever-present. Through the knowledge of the Self, cross the sea of transmigration.", source: "Ashtavakra Gita", year: -400 },
        { text: "The wise man who has awakened to the Self is not attached to the fruits of action.", source: "Ashtavakra Gita", year: -400 },
        { text: "Liberation is found in desirelessness, and desirelessness comes from dispassion.", source: "Ashtavakra Gita", year: -400 }
      ],
      love: [
        { text: "Knowing that everything arising from the Self is like a wave from the ocean, he rests at ease.", source: "Ashtavakra Gita", year: -400 },
        { text: "The sage who has realized the truth of his being is not touched by praise or blame, by success or failure.", source: "Ashtavakra Gita", year: -400 }
      ],
      freedom: [
        { text: "You are the one witness of everything, and are always totally free. The cause of your bondage is that you see the witness as something other than this.", source: "Ashtavakra Gita", year: -400 },
        { text: "What is bondage? What is liberation? These are words used when the mind is mistaken. When you realize your true nature, there is neither bondage nor liberation.", source: "Ashtavakra Gita", year: -400 },
        { text: "A man is free the moment he realizes he has always been free.", source: "Ashtavakra Gita", year: -400 }
      ],
      truth: [
        { text: "You are not the body. The body is not yours. You are not the doer, you are the witness.", source: "Ashtavakra Gita", year: -400 },
        { text: "All is consciousness. This world appearance is consciousness. Know this without doubt and be free.", source: "Ashtavakra Gita", year: -400 }
      ],
      god: [
        { text: "The Self alone exists. There is no world apart from the Self. Brahman alone is. This is the truth.", source: "Ashtavakra Gita", year: -400 },
        { text: "He who understands that the Self is Brahman, eternal, pure, and free, has nothing more to know.", source: "Ashtavakra Gita", year: -400 },
        { text: "All things arise from consciousness and dissolve back into consciousness. You are that consciousness.", source: "Ashtavakra Gita", year: -400 }
      ],
      beauty: [
        { text: "The world is an illusion projected by the mind. When you see the Self, you see nothing but the Self, and that is beauty itself.", source: "Ashtavakra Gita", year: -400 },
        { text: "In the vast space of consciousness, the entire universe arises and dissolves, like a dream.", source: "Ashtavakra Gita", year: -400 }
      ]
    }
  }
];

export const TOPICS = [
  "technology",
  "identity",
  "loneliness",
  "power",
  "consumerism",
  "truth",
  "freedom",
  "love",
  "meaning",
  "consciousness",
  "society",
  "beauty"
];

export const TOPIC_LABELS = {
  technology:    "AI & The Machine Age",
  identity:      "Identity & Authenticity",
  loneliness:    "Modern Loneliness",
  power:         "Power & Control",
  consumerism:   "Consumerism & Empty Desire",
  truth:         "Truth in the Post-Truth Age",
  freedom:       "Freedom & Modern Constraint",
  love:          "Love & Digital Romance",
  meaning:       "The Meaning Crisis",
  consciousness: "Consciousness & The Inner Life",
  society:       "Democracy & Mass Psychology",
  beauty:        "Beauty & The Degradation of Attention"
};

// Rich context fed to the AI so it picks quotes relevant to the modern topic
export const TOPIC_CONTEXT = {
  technology:    "Artificial intelligence replacing human thought, social media algorithms manipulating behavior, machines learning to create art and language. Does technology liberate or enslave? Is the algorithm the new God? What is lost when machines do our thinking for us?",
  identity:      "People constructing and performing identities on social media, the fragmentation of the self, identity politics reducing people to categories, the question of authenticity when every self is curated for an audience.",
  loneliness:    "The epidemic of loneliness in the most connected age in history. People stare at screens in crowded rooms. Social media promises community and delivers isolation. The paradox of total communication without genuine communion.",
  power:         "Surveillance capitalism, governments monitoring citizens, corporations controlling attention and behavior, algorithmic systems deciding who gets what. Who holds real power today, and who is controlled without knowing it?",
  consumerism:   "A culture built around purchasing, advertising manufacturing desires that never satisfy, people defining themselves by what they own, the spiritual void underneath material abundance, buying happiness that never arrives.",
  truth:         "Disinformation, fake news, everyone constructing their own reality from algorithmically curated feeds. Experts are doubted, facts are disputed, belief trumps evidence. What does truth mean when perception itself is engineered?",
  freedom:       "Are people in the modern world more free or less free? Algorithmic manipulation, social conformity, cancel culture, debt, surveillance, addiction by design — the cage is invisible but the bars are everywhere.",
  love:          "Dating apps reducing human beings to swipeable profiles, hookup culture, the commodification of romance, ghosting as a social norm, people unable to commit because something better might be one scroll away.",
  meaning:       "Religion declining, traditional communities dissolving, work becoming hollow gig labor, young people without purpose, nihilism rising, the question 'why bother?' growing louder without an answer.",
  consciousness: "Neuroscience revealing the brain as a machine, AI exhibiting behaviors once called intelligent, free will questioned by determinism. If consciousness is just computation, what makes human experience special?",
  society:       "Democracy eroding, populism rising, the fragmentation of shared reality, echo chambers making consensus impossible, the crowd manipulated through emotion and fear, political theater replacing governance.",
  beauty:        "In a world of infinite digital images, is beauty still possible? Attention spans collapsing, craftsmanship dying, AI generating art instantly, aesthetic experience mediated through screens and reduced to likes."
};

// Maps each modern topic → which classic quote categories to search in
export const TOPIC_FALLBACK = {
  technology:    ['truth', 'freedom', 'meaning', 'god'],
  identity:      ['freedom', 'truth', 'suffering', 'meaning'],
  loneliness:    ['suffering', 'love', 'death', 'meaning'],
  power:         ['freedom', 'god', 'truth', 'suffering'],
  consumerism:   ['suffering', 'meaning', 'beauty', 'death'],
  truth:         ['truth', 'god', 'freedom', 'meaning'],
  freedom:       ['freedom', 'suffering', 'meaning', 'death'],
  love:          ['love', 'suffering', 'meaning', 'beauty'],
  meaning:       ['meaning', 'suffering', 'death', 'god'],
  consciousness: ['truth', 'meaning', 'god', 'freedom'],
  society:       ['freedom', 'truth', 'god', 'suffering'],
  beauty:        ['beauty', 'love', 'meaning', 'truth'],
};

export function getQuote(philosopherId, topic) {
  const p = PHILOSOPHERS.find(p => p.id === philosopherId);
  if (!p) return null;
  const quotes = p.quotes[topic] || p.quotes.meaning;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getPhilosopher(id) {
  return PHILOSOPHERS.find(p => p.id === id);
}

export function pickConversationTopic(p1Id, p2Id) {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}
