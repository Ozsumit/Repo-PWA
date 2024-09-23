import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import * as LucideIcons from "lucide-react";

// import { toast } from "sonner";
import {
  Coins,
  Heart,
  Trophy,
  Medal,
  Save,
  Clock,
  Zap,
  Star,
  Gift,
  Sparkles,
  Target,
  Snowflake,
} from "lucide-react";

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
    icon: <Heart size={16} />,
  },
  {
    id: "donations100",
    name: "Generous Soul",
    description: "Reach 100 donations",
    threshold: 100,
    achieved: false,
    icon: <Heart size={16} />,
  },
  {
    id: "donations1000",
    name: "Philanthropist",
    description: "Reach 1,000 donations",
    threshold: 1000,
    achieved: false,
    icon: <Heart size={16} />,
  },
  {
    id: "donations10000",
    name: "Benefactor",
    description: "Reach 10,000 donations",
    threshold: 10000,
    achieved: false,
    icon: <Heart size={16} />,
  },
  {
    id: "donations100000",
    name: "Humanitarian",
    description: "Reach 100,000 donations",
    threshold: 100000,
    achieved: false,
    icon: <Heart size={16} />,
  },
  {
    id: "autoclickers1",
    name: "Automation Beginner",
    description: "Have 1 auto-clicker",
    threshold: 1,
    achieved: false,
    icon: <Clock size={16} />,
  },
  {
    id: "autoclickers5",
    name: "Booming Business",
    description: "Have 5 auto-clickers",
    threshold: 5,
    achieved: false,
    icon: <Clock size={16} />,
  },
  {
    id: "autoclickers25",
    name: "Automation Expert",
    description: "Have 25 auto-clickers",
    threshold: 25,
    achieved: false,
    icon: <Clock size={16} />,
  },
  {
    id: "autoclickers100",
    name: "Automation Tycoon",
    description: "Have 100 auto-clickers",
    threshold: 100,
    achieved: false,
    icon: <Clock size={16} />,
  },
  {
    id: "clickpower5",
    name: "Power Donor",
    description: "Reach click power of 5",
    threshold: 5,
    achieved: false,
    icon: <Zap size={16} />,
  },
  {
    id: "clickpower25",
    name: "Super Donor",
    description: "Reach click power of 25",
    threshold: 25,
    achieved: false,
    icon: <Zap size={16} />,
  },
  {
    id: "clickpower100",
    name: "Mega Donor",
    description: "Reach click power of 100",
    threshold: 100,
    achieved: false,
    icon: <Zap size={16} />,
  },
  {
    id: "specialitems1",
    name: "Treasure Hunter",
    description: "Acquire 1 special item",
    threshold: 1,
    achieved: false,
    icon: <Gift size={16} />,
  },
  {
    id: "specialitems5",
    name: "Collector",
    description: "Acquire 5 special items",
    threshold: 5,
    achieved: false,
    icon: <Gift size={16} />,
  },
];

const specialItems: SpecialItem[] = [
  {
    id: "goldenHeart",
    name: "Golden Heart",
    description: "Doubles your click power for 30 seconds",
    cost: 1000,
    effect: (state) => ({ clickPower: state.clickPower * 2 }),
    icon: <Heart color="gold" />,
  },
  {
    id: "luckyCharm",
    name: "Lucky Charm",
    description: "20% chance to get double donations for 1 minute",
    cost: 750,
    effect: (state) => ({ donations: state.donations }),
    icon: <Sparkles color="green" />,
  },
  {
    id: "timeWarp",
    name: "Time Warp",
    description: "Doubles auto-clicker speed for 1 minute",
    cost: 2000,
    effect: (state) => ({ autoClickerCount: state.autoClickerCount * 2 }),
    icon: <Clock color="blue" />,
  },
  {
    id: "donationMultiplier",
    name: "Donation Multiplier",
    description: "Triples your donations for the next 20 clicks",
    cost: 1500,
    effect: (state) => ({ donations: state.donations }),
    icon: <Target color="purple" />,
  },
  {
    id: "frostBonus",
    name: "Frost Bonus",
    description: "Freezes auto-clicker cost increase for 2 minutes",
    cost: 1200,
    effect: (state) => ({ autoClickerCost: state.autoClickerCost }),
    icon: <Snowflake color="cyan" />,
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

    const autoClickInterval = setInterval(autoClickSave, 5000);

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
          [item.id]: Date.now() + (item.id === "timeWarp" ? 60000 : 120000),
        }));

        // Display toast notification
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
                    // These items don't need reverting
                    return prev;
                  default:
                    return prev;
                }
              }
              return prev;
            });

            // Display toast notification when effect ends
            const item = specialItems.find((i) => i.id === id);
            if (item) {
              toast.info(`${item.name} effect has ended`, {
                icon: item.icon,
              });
            }
          }
        });
        return newItems;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sortedAchievements = useMemo(
    () => [...gameState.achievements].sort((a, b) => a.threshold - b.threshold),
    [gameState.achievements]
  );

  const renderSpecialItems = useMemo(() => {
    return gameState.specialItems?.map((item) => (
      <button
        key={item.id}
        onClick={() => buySpecialItem(item)}
        disabled={gameState.donations < item.cost}
        className={`p-2 bg-slate-750 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-700 ${
          activeItems[item.id] ? "border-2 border-yellow-400" : ""
        }`}
        title={item.description}
      >
        {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
        <div className="text-xs">{item.name}</div>
        <div className="text-xs">{item.cost} coins</div>
        {activeItems[item.id] && (
          <div className="text-xs text-yellow-400">
            {Math.ceil((activeItems[item.id] - Date.now()) / 1000)}s
          </div>
        )}
      </button>
    ));
  }, [
    gameState.specialItems,
    activeItems,
    gameState.donations,
    buySpecialItem,
  ]);

  const achievementsList = useMemo(
    () =>
      sortedAchievements.map((achievement) => (
        <div
          key={achievement.id}
          className={`p-2 rounded border-gray-500 border-[1px] ${
            achievement.achieved ? "bg-accenth" : "bg-black"
          } cursor-pointer`}
          title={achievement.description}
          onClick={() =>
            toast(
              `${achievement.name}: ${achievement.description}\nRequirement: ${achievement.threshold}`
            )
          }
        >
          {React.cloneElement(achievement.icon as React.ReactElement, {
            size: 16,
          })}
          <span className="ml-1">{achievement.name}</span>
        </div>
      )),
    [sortedAchievements]
  );

  return (
    <div className="md:w-144 w-[90vw] mx-auto p-4 bg-black border-2 border-accent rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        Donation Clicker
      </h1>

      <div className="text-4xl font-bold mb-4">
        <LucideIcons.Coins className="inline mr-2 text-yellow-500" />
        {gameState.donations.toLocaleString()}
      </div>

      <button
        onClick={handleClick}
        className="w-full py-4 px-6 mb-4 bg-green-500 text-white text-xl font-bold rounded-lg hover:bg-green-600 transition-colors"
      >
        <LucideIcons.Heart className="inline mr-2" /> Donate!
      </button>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={buyAutoClicker}
          disabled={gameState.donations < gameState.autoClickerCost}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          <Clock className="inline mr-2" /> {gameState.autoClickerCost}
        </button>

        <button
          onClick={buyUpgrade}
          disabled={gameState.donations < gameState.upgradeCost}
          className="py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
        >
          <Zap className="inline mr-2" /> {gameState.upgradeCost}
        </button>
      </div>

      <div className="text-xl mb-4 flex justify-around">
        <div>
          <Clock className="inline mr-2 text-orange-500" />{" "}
          {gameState.autoClickerLevel}
        </div>
        <div>
          <Zap className="inline mr-2 text-orange-500" /> {gameState.clickPower}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Special Items</h2>
        <div className="grid grid-cols-3 gap-2">{renderSpecialItems}</div>
      </div>

      <button
        ref={saveButtonRef}
        onClick={saveProgress}
        className="w-6/12 py-2 px-4 mb-4 bg-grays text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Save className="inline mr-2" /> Save
      </button>

      <div className="grid grid-cols-2 gap-2 text-left mb-4">
        {achievementsList}
      </div>

      {showAchievement && (
        <div className="fixed bottom-4 left-4 p-4 bg-yellow-500 text-black rounded-lg shadow-lg animate-bounce">
          <Medal className="inline mr-2 text-yellow-600" />
          {showAchievement.name}
        </div>
      )}

      {saveIndicator && (
        <div className="fixed bottom-4 right-4 p-2 bg-green-100 border border-green-300 text-green-800 rounded-lg shadow-lg">
          <Save className="inline mr-2 text-green-600" />
          Saved!
        </div>
      )}
    </div>
  );
};

export default DonationClicker;
