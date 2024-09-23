import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";

type Achievement = {
  id: string;
  name: string;
  description: string;
  threshold: number;
  achieved: boolean;
  icon: React.ReactNode;
};

type SpecialItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: (state: GameState) => Partial<GameState>;
  icon: React.ReactNode;
};

type GameState = {
  donations: number;
  clickPower: number;
  autoClickerCount: number;
  autoClickerCost: number;
  upgradeCost: number;
  achievements: Achievement[];
  upgradeLevel: number;
  autoClickerLevel: number;
  specialItems: SpecialItem[];
  luckyCharmActive: boolean;
  donationMultiplierClicks: number;
  frostBonusActive: boolean;
};

const initialAchievements: Achievement[] = [
  {
    id: "donations10",
    name: "Novice Donor",
    description: "Reach 10 donations",
    threshold: 10,
    achieved: false,
    icon: <LucideIcons.Heart />,
  },
  {
    id: "donations100",
    name: "Generous Soul",
    description: "Reach 100 donations",
    threshold: 100,
    achieved: false,
    icon: <LucideIcons.Heart />,
  },
  {
    id: "donations1000",
    name: "Philanthropist",
    description: "Reach 1,000 donations",
    threshold: 1000,
    achieved: false,
    icon: <LucideIcons.Heart />,
  },
  {
    id: "donations10000",
    name: "Benefactor",
    description: "Reach 10,000 donations",
    threshold: 10000,
    achieved: false,
    icon: <LucideIcons.Heart />,
  },
  {
    id: "donations100000",
    name: "Humanitarian",
    description: "Reach 100,000 donations",
    threshold: 100000,
    achieved: false,
    icon: <LucideIcons.Heart />,
  },
  {
    id: "autoclickers1",
    name: "Automation Beginner",
    description: "Have 1 auto-clicker",
    threshold: 1,
    achieved: false,
    icon: <LucideIcons.Clock />,
  },
  {
    id: "autoclickers5",
    name: "Booming Business",
    description: "Have 5 auto-clickers",
    threshold: 5,
    achieved: false,
    icon: <LucideIcons.Clock />,
  },
  {
    id: "autoclickers25",
    name: "Automation Expert",
    description: "Have 25 auto-clickers",
    threshold: 25,
    achieved: false,
    icon: <LucideIcons.Clock />,
  },
  {
    id: "autoclickers100",
    name: "Automation Tycoon",
    description: "Have 100 auto-clickers",
    threshold: 100,
    achieved: false,
    icon: <LucideIcons.Clock />,
  },
  {
    id: "clickpower5",
    name: "Power Donor",
    description: "Reach click power of 5",
    threshold: 5,
    achieved: false,
    icon: <LucideIcons.Zap />,
  },
  {
    id: "clickpower25",
    name: "Super Donor",
    description: "Reach click power of 25",
    threshold: 25,
    achieved: false,
    icon: <LucideIcons.Zap />,
  },
  {
    id: "clickpower100",
    name: "Mega Donor",
    description: "Reach click power of 100",
    threshold: 100,
    achieved: false,
    icon: <LucideIcons.Zap />,
  },
  {
    id: "specialitems1",
    name: "Treasure Hunter",
    description: "Acquire 1 special item",
    threshold: 1,
    achieved: false,
    icon: <LucideIcons.Gift />,
  },
  {
    id: "specialitems5",
    name: "Collector",
    description: "Acquire 5 special items",
    threshold: 5,
    achieved: false,
    icon: <LucideIcons.Gift />,
  },
];

const specialItems: SpecialItem[] = [
  {
    id: "goldenHeart",
    name: "Golden Heart",
    description: "Doubles your click power for 30 seconds",
    cost: 10000,
    effect: (state) => ({ clickPower: state.clickPower * 2 }),
    icon: <LucideIcons.Heart color="gold" />,
  },
  {
    id: "luckyCharm",
    name: "Lucky Charm",
    description: "20% chance to get double donations for 1 minute",
    cost: 1000,
    effect: (state) => ({ donations: state.donations }),
    icon: <LucideIcons.Sparkles color="green" />,
  },
  {
    id: "timeWarp",
    name: "Time Warp",
    description: "Doubles auto-clicker power for 1 minute",
    cost: 5000,
    effect: (state) => ({ autoClickerCount: state.autoClickerCount * 2 }),
    icon: <LucideIcons.Clock color="blue" />,
  },
  {
    id: "donationMultiplier",
    name: "Donation Multiplier",
    description: "Triples your donations for the next 20 clicks",
    cost: 7000,
    effect: (state) => ({ donations: state.donations }),
    icon: <LucideIcons.Target color="purple" />,
  },
  {
    id: "frostBonus",
    name: "Frost Bonus",
    description: "Freezes auto-clicker cost increase for 2 minutes",
    cost: 5000,
    effect: (state) => ({ autoClickerCost: state.autoClickerCost }),
    icon: <LucideIcons.Snowflake color="cyan" />,
  },
];

const initialGameState: GameState = {
  donations: 0,
  specialItems: specialItems,
  clickPower: 1,
  autoClickerCount: 0,
  autoClickerCost: 10,
  upgradeCost: 50,
  achievements: initialAchievements,
  upgradeLevel: 0,
  autoClickerLevel: 0,
  luckyCharmActive: false,
  donationMultiplierClicks: 0,
  frostBonusActive: false,
};
// Custom hook that handles input logic and button visibility
const useRevealButtons = (keywords: string[]) => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Function to check if any keyword is included in the input
  const shouldShowButtons =
    isSubmitted &&
    keywords.some((keyword) => inputValue.toLowerCase().includes(keyword));

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  // Return the necessary values
  return {
    inputValue,
    setInputValue,
    shouldShowButtons,
    handleSubmit,
  };
};

const DonationClicker: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("donationClickerState");
      return savedState ? JSON.parse(savedState) : initialGameState;
    } else {
      return initialGameState;
    }
  });

  const [showAchievement, setShowAchievement] = useState<Achievement | null>(
    null
  );
  const [saveIndicator, setSaveIndicator] = useState<boolean>(false);
  const [activeItems, setActiveItems] = useState<{ [key: string]: number }>({});

  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const saveProgress = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("donationClickerState", JSON.stringify(gameState));
      setSaveIndicator(true);
      setTimeout(() => setSaveIndicator(false), 1000);
    }
  }, [gameState]);

  useEffect(() => {
    const autoClickSave = () => {
      if (saveButtonRef.current) {
        saveButtonRef.current.click();
      }
    };
    const autoClickInterval = setInterval(autoClickSave, 1000);
    return () => clearInterval(autoClickInterval);
  }, []);

  const handleClick = useCallback(() => {
    setGameState((prev) => {
      let donationIncrease = prev.clickPower;
      if (prev.luckyCharmActive && Math.random() < 0.2) {
        donationIncrease *= 2;
      }
      if (prev.donationMultiplierClicks > 0) {
        donationIncrease *= 3;
      }
      return {
        ...prev,
        donations: prev.donations + donationIncrease,
        donationMultiplierClicks: Math.max(
          0,
          prev.donationMultiplierClicks - 1
        ),
      };
    });
  }, []);
  const addaura = useCallback(() => {
    setGameState((prev) => {
      let donationIncrease = prev.clickPower;
      if (prev.luckyCharmActive && Math.random() < 0.2) {
        donationIncrease *= 10000000;
      }
      if (prev.donationMultiplierClicks > 0) {
        donationIncrease *= 10000000;
      }
      return {
        ...prev,
        donations: prev.donations * 100,
        donationMultiplierClicks: Math.max(
          0,
          prev.donationMultiplierClicks - 100
        ),
      };
    });
  }, []);
  const minusaura = useCallback(() => {
    setGameState((prev) => {
      let donationIncrease = prev.clickPower;
      if (prev.luckyCharmActive && Math.random() < 0.2) {
        donationIncrease *= 10000000;
      }
      if (prev.donationMultiplierClicks > 0) {
        donationIncrease *= 10000000;
      }
      return {
        ...prev,
        donations: prev.donations / 100,
        donationMultiplierClicks: Math.max(
          0,
          prev.donationMultiplierClicks - 100
        ),
      };
    });
  }, []);
  const buyAutoClicker = useCallback(() => {
    setGameState((prev) => {
      if (prev.donations >= prev.autoClickerCost) {
        const newAutoClickerCost = prev.frostBonusActive
          ? prev.autoClickerCost
          : Math.ceil(prev.autoClickerCost * 1.5);

        return {
          ...prev,
          donations: prev.donations - prev.autoClickerCost,
          autoClickerCount: prev.autoClickerCount + 1,
          autoClickerCost: newAutoClickerCost,
          autoClickerLevel: prev.autoClickerCount + 1,
        };
      }
      return prev;
    });
  }, []);

  const buyUpgrade = useCallback(() => {
    setGameState((prev) => {
      if (prev.donations >= prev.upgradeCost) {
        return {
          ...prev,
          donations: prev.donations - prev.upgradeCost,
          clickPower: prev.clickPower + 1,
          upgradeCost: Math.ceil(prev.upgradeCost * 1.7),
          upgradeLevel: prev.upgradeLevel + 1,
        };
      }
      return prev;
    });
  }, []);

  const buySpecialItem = useCallback((item: SpecialItem) => {
    setGameState((prev) => {
      if (prev.donations >= item.cost) {
        const newState = {
          ...prev,
          donations: prev.donations - item.cost,
          ...item.effect(prev),
        };
        if (item.id === "frostBonus") {
          newState.frostBonusActive = true;
        }
        setActiveItems((prevItems) => ({
          ...prevItems,
          [item.id]: Date.now() + (item.id === "timeWarp" ? 30000 : 60000),
        }));
        toast.success(`Activated: ${item.name}`, {
          description: item.description,
          icon: item.icon,
        });
        return newState;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          donations: prev.donations + prev.autoClickerCount,
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState.autoClickerCount]);

  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = gameState.achievements.map((achievement) => {
        if (!achievement.achieved) {
          let achieved = false;
          switch (achievement.id) {
            case "donations10":
            case "donations100":
            case "donations1000":
            case "donations10000":
            case "donations100000":
              achieved = gameState.donations >= achievement.threshold;
              break;
            case "autoclickers1":
            case "autoclickers5":
            case "autoclickers25":
            case "autoclickers100":
              achieved = gameState.autoClickerCount >= achievement.threshold;
              break;
            case "clickpower5":
            case "clickpower25":
            case "clickpower100":
              achieved = gameState.clickPower >= achievement.threshold;
              break;
            case "specialitems1":
            case "specialitems5":
              achieved =
                Object.keys(activeItems).length >= achievement.threshold;
              break;
          }
          if (achieved) {
            setShowAchievement(achievement);
            setTimeout(() => setShowAchievement(null), 3000);
            return { ...achievement, achieved: true };
          }
        }
        return achievement;
      });

      if (
        JSON.stringify(newAchievements) !==
        JSON.stringify(gameState.achievements)
      ) {
        setGameState((prev) => ({ ...prev, achievements: newAchievements }));
      }
    };
    checkAchievements();
  }, [gameState, activeItems]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItems((prevItems) => {
        const newItems = { ...prevItems };
        Object.entries(newItems).forEach(([id, endTime]) => {
          if (Date.now() > endTime) {
            delete newItems[id];
            setGameState((prev) => {
              const item = specialItems.find((i) => i.id === id);
              if (item) {
                switch (id) {
                  case "goldenHeart":
                    return { ...prev, clickPower: prev.clickPower / 2 };
                  case "timeWarp":
                    return {
                      ...prev,
                      autoClickerCount: prev.autoClickerCount / 2,
                    };
                  case "luckyCharm":
                  case "donationMultiplier":
                  case "frostBonus":
                    return {
                      ...prev,
                      luckyCharmActive: false,
                      frostBonusActive: false,
                    };
                }
              }
              return prev;
            });
          }
        });
        return newItems;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { inputValue, setInputValue, shouldShowButtons, handleSubmit } =
    useRevealButtons(["imalazyass", "imthedeveloper", "imthedevsgf"]);
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-mono w-[90vw] lg:w-144 justify-center  items-center flex flex-col mb-12 font-bold ">
        Beat the high score of
        <span className="text-yellow-400  flex items-center">
          <LucideIcons.Coins className="text-yellow-400" size={44} />
          1245617869
        </span>
        to get free lunch
      </h1>{" "}
      <div className="bg-black p-4 rounded-lg shadow-lg w-[90vw] lg:w-144 text-white mx-auto border-2 border-accenth">
        {/* Top Section with Coins and Donations */}
        <div className="flex justify-center text-center mb-4">
          <div className="mr-4 flex items-center space-x-2">
            <LucideIcons.Coins className="text-yellow-400" size={44} />
            <p className=" text-5xl font-mono font-bold">
              {gameState.donations}
            </p>
          </div>
          {/* <div className="ml-4 flex items-center space-x-2">
      <LucideIcons.Zap className="text-orange-400" size={24} />
      <p className="text-lg">{gameState.clickPower}</p>
    </div> */}
        </div>

        {/* Donate Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleClick}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-md w-full text-lg font-bold"
          >
            Donate!
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={buyAutoClicker}
            disabled={gameState.donations < gameState.autoClickerCost}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            <LucideIcons.Clock className="inline mr-2" />{" "}
            {gameState.autoClickerCost}
          </button>

          <button
            onClick={buyUpgrade}
            disabled={gameState.donations < gameState.upgradeCost}
            className="py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
          >
            <LucideIcons.Zap className="inline mr-2" /> {gameState.upgradeCost}
          </button>
        </div>

        <div className="text-xl mb-4 flex justify-around">
          <div>
            <LucideIcons.Clock className="inline mr-2 text-orange-500" />{" "}
            {gameState.autoClickerLevel}
          </div>
          <div>
            <LucideIcons.Zap className="inline mr-2 text-orange-500" />{" "}
            {gameState.clickPower}
          </div>
        </div>
        {/* Special Items */}
        <h2 className="text-center text-lg font-bold mb-4">Special Items</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {specialItems.map((item) => {
            const isActive =
              activeItems[item.id] && activeItems[item.id] > Date.now();
            return (
              <button
                title={item.description}
                key={item.id}
                onClick={() => buySpecialItem(item)}
                disabled={gameState.donations < item.cost || !!isActive} // Ensure boolean value
                className={`py-2 px-4 rounded-lg flex items-center justify-center gap-1 ${
                  gameState.donations < item.cost || !!isActive // Ensure boolean value
                    ? "opacity-100 bg-slate-900 cursor-not-allowed"
                    : "bg-gray-600  hover:bg-gray-700"
                } ${
                  !!isActive
                    ? "bg-neutral-600 border-2  border-yellow-400 text-white"
                    : ""
                } text-white`}
              >
                <div className="flex flex-col justify-center items-center">
                  <div className="flex flex-row gap-1 justify-center items-center">
                    <span className="text-sm">{item.name}</span>
                    <span>{item.icon}</span>
                  </div>
                  <span className="text-sm text-yellow-400">
                    {item.cost} coins
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Save Button */}

        {/* Achievements */}
        <h2 className="text-center text-lg font-bold mt-6 mb-4">
          Achievements
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {gameState.achievements.map((achievement) => (
            <button
              onClick={() =>
                toast(
                  `${achievement.name}: ${achievement.description}\nRequirement: ${achievement.threshold}`
                )
              }
              key={achievement.id}
              className="bg-transparent border border-gray-400 hover:border-white text-white py-2 px-4 rounded-lg text-xs flex items-center justify-center"
            >
              <span>
                <LucideIcons.Medal className="inline mr-2 text-yellow-600" />
              </span>
              <span>{achievement.name}</span>
            </button>
          ))}
        </div>

        <div className="text-center mt-4">
          <button
            ref={saveButtonRef}
            onClick={saveProgress}
            className={`bg-gray-600 hidden text-white py-1 px-3 rounded-md text-sm ${
              saveIndicator ? "opacity-100" : "opacity-50"
            }`}
          >
            {saveIndicator ? "Progress Saved!" : "Save Progress"}
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mb-4">
        {/* Other elements on your page */}
        {/* <h1 className="text-2xl font-bold">Welcome to the Page</h1> */}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Enter sceret code"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="px-4 py-2 border rounded-lg text-white bg-slate-950"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-500 text-white rounded-lg ml-2"
          >
            ✓
          </button>
        </form>

        {/* Conditionally render buttons after form is submitted */}
        {shouldShowButtons && (
          <div className="mt-4 flex gap-2">
            <button
              id="aura"
              onClick={addaura}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              *100{" "}
            </button>
            <button
              onClick={minusaura}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              /100
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationClicker;
