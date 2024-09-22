"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Coins, Heart, Trophy, Medal, Save, Clock, Zap } from "lucide-react";

type Achievement = {
  id: string;
  name: string;
  description: string;
  threshold: number;
  achieved: boolean;
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
};

const initialAchievements: Achievement[] = [
  {
    id: "donations100",
    name: "Generous Soul",
    description: "Reach 100 donations",
    threshold: 100,
    achieved: false,
  },
  {
    id: "donations1000",
    name: "Philanthropist",
    description: "Reach 1,000 donations",
    threshold: 1000,
    achieved: false,
  },
  {
    id: "donations10000",
    name: "Benefactor",
    description: "Reach 10,000 donations",
    threshold: 10000,
    achieved: false,
  },
  {
    id: "donations100000",
    name: "Humanitarian",
    description: "Reach 100,000 donations",
    threshold: 100000,
    achieved: false,
  },
  {
    id: "autoclickers5",
    name: "Booming Business",
    description: "Have 5 auto-clickers",
    threshold: 5,
    achieved: false,
  },
  {
    id: "autoclickers25",
    name: "Automation Expert",
    description: "Have 25 auto-clickers",
    threshold: 25,
    achieved: false,
  },
  {
    id: "autoclickers100",
    name: "Elon Musk",
    description: "Have 100 auto-clickers",
    threshold: 100,
    achieved: false,
  },
  {
    id: "clickpower5",
    name: "Power Donor",
    description: "Reach click power of 5",
    threshold: 5,
    achieved: false,
  },
  {
    id: "clickpower25",
    name: "Super Donor",
    description: "Reach click power of 25",
    threshold: 25,
    achieved: false,
  },
  {
    id: "clickpower100",
    name: "Mega Donor",
    description: "Reach click power of 100",
    threshold: 100,
    achieved: false,
  },
];

const initialGameState: GameState = {
  donations: 0,
  clickPower: 1,
  autoClickerCount: 0,
  autoClickerCost: 10,
  upgradeCost: 50,
  achievements: initialAchievements,
  upgradeLevel: 0,
  autoClickerLevel: 0,
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

  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const saveProgress = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("donationClickerState", JSON.stringify(gameState));
      setSaveIndicator(true);
      setTimeout(() => setSaveIndicator(false), 1000);
    }
  }, [gameState]);

  // New useEffect for automatic clicking of the save button every 10 seconds
  useEffect(() => {
    const autoClickSave = () => {
      if (saveButtonRef.current) {
        saveButtonRef.current.click();
      }
    };

    const autoClickInterval = setInterval(autoClickSave, 5000); // Click save every 10 seconds

    return () => clearInterval(autoClickInterval);
  }, []);

  const handleClick = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      donations: prev.donations + prev.clickPower,
    }));
  }, []);

  const buyAutoClicker = useCallback(() => {
    setGameState((prev) => {
      if (prev.donations >= prev.autoClickerCost) {
        return {
          ...prev,
          donations: prev.donations - prev.autoClickerCost,
          autoClickerCount: prev.autoClickerCount + 1,
          autoClickerCost: Math.ceil(prev.autoClickerCost * 1.5),
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
            case "donations100":
            case "donations1000":
            case "donations10000":
            case "donations100000":
              achieved = gameState.donations >= achievement.threshold;
              break;
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
  }, [gameState]);

  const achievementsList = useMemo(
    () =>
      gameState.achievements.map((achievement) => (
        <div
          key={achievement.id}
          className={`p-2 rounded border-gray-500 border-[1px] ${
            achievement.achieved ? "bg-accenth" : "bg-black"
          }`}
          title={achievement.description}
        >
          <Trophy
            className={`inline mr-1 ${
              achievement.achieved ? "text-yellow-400" : "text-gray-500"
            }`}
          />
          {achievement.name}
        </div>
      )),
    [gameState.achievements]
  );

  return (
    <div className="md:w-144 w-[90vw] mx-auto p-4 bg-black border-2 border-accent rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        Donation Clicker
      </h1>

      <div className="text-4xl font-bold mb-4">
        <Coins className="inline mr-2 text-yellow-500" />
        {gameState.donations.toLocaleString()}
      </div>

      <button
        onClick={handleClick}
        className="w-full py-4 px-6 mb-4 bg-green-500 text-white text-xl font-bold rounded-lg hover:bg-green-600 transition-colors"
      >
        <Heart className="inline mr-2" /> Donate!
      </button>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={buyAutoClicker}
          disabled={gameState.donations < gameState.autoClickerCost}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          <Clock className="inline mr-2 " /> {gameState.autoClickerCost}
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
        <div className="absolute bottom-4 left-4 p-4 bg-yellow-500 text-black rounded-lg shadow-lg animate-bounce">
          <Medal className="inline mr-2 text-yellow-600" />
          {showAchievement.name}
        </div>
      )}

      {saveIndicator && (
        <div className="absolute hidden bottom-4 right-4 p-2 bg-green-100 border border-green-300 text-green-800 rounded-lg shadow-lg">
          <Save className="inline mr-2 text-green-600" />
          Saved!
        </div>
      )}
    </div>
  );
};

export default DonationClicker;
