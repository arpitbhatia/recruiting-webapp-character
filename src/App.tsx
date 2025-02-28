import { useEffect, useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';

type AttributesCount = { [key: string]: number };
const GITHUB_USER = "{{arpitbhatia}}}";
const API_URL = `https://recruiting.verylongdomaintotestwith.ca/api/${GITHUB_USER}/character`;
const MAX_ATTRIBUTE_TOTAL = 70;


function App() {

  const [attributesCount, setAttributesCount] = useState(
    ATTRIBUTE_LIST.reduce((att, item) => {
      att[item] = 10;
      return att;
    }, {} as AttributesCount)
  );

  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const [skillPointsCount, setSkillPointsCount] = useState<Record<string, number>>(
    SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {})
  );

  useEffect(() => {
    console.log(API_URL);
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.attributes) setAttributesCount(data.attributes);
            if (data.skillPoints) setSkillPointsCount(data.skillPoints);
            if (data.selectedClass) setSelectedClass(data.selectedClass);
        })
        .catch(console.error);
  }, []);

  const saveCharacter = () => {
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attributesCount, skillPointsCount, selectedClass })
    }).catch(console.error);
  };

  const calculateModifier = (value: number) => {
    return Math.floor((value - 10) / 2);
  };

  const availableSkillPoints = 10 + 4 * calculateModifier(attributesCount.Intelligence);
  const totalSpentPoints = Object.values(skillPointsCount).reduce((sum, points) => sum + points, 0);
  const totalAttributePoints = Object.values(attributesCount).reduce((sum, val) => sum + val, 0);

  const handleIncrement = (attr: string) => {
    if (totalAttributePoints < MAX_ATTRIBUTE_TOTAL) {
      setAttributesCount(prev => {
        const updated = { ...prev, [attr]: prev[attr] + 1 }
        saveCharacter();
        return updated;
      });
    };
  };
  
  const handleDecrement = (attr: string) => {
      setAttributesCount(prev => { 
        const updated = { ...prev, [attr]: Math.max(0, prev[attr] - 1) };
        saveCharacter();
        return updated;
    });
  };
  
  const handleSkillIncrement = (skill: string) => {
    if (totalSpentPoints < availableSkillPoints) {
       setSkillPointsCount(prev => {
        const updated = { ...prev, [skill]: prev[skill] + 1 };
        saveCharacter();
        return updated;
    });
  };
  };
  
  const handleSkillDecrement = (skill: string) => {
    setSkillPointsCount(prev => {
      const updated = { ...prev, [skill]: Math.max(0, prev[skill] - 1) };
      saveCharacter();
      return updated;
    });
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <>
          <div><b>Attributes</b>{ATTRIBUTE_LIST.map((item) => {
            return(
            <div key={item}>
              <p> {item}: {attributesCount[item]}</p>
              <button onClick={() => handleIncrement(item)}>+</button>
              <button onClick={() => handleDecrement(item)}>-</button>
            </div>)
            })}
          </div>
          <div><b>Classes</b>
            {Object.keys(CLASS_LIST).map(className => (
              <div onClick={() => setSelectedClass(className)}>{className}</div>
            ))}
          </div>
          {selectedClass && CLASS_LIST[selectedClass] && (
            <div> <b>Class selected:  {selectedClass}</b>
              <ul>
                {Object.entries(CLASS_LIST[selectedClass] || {}).map(([attr, value]) => (
                  <li key={attr}>
                    {attr}: {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4">
                <h2 className="font-bold text-lg">Skills</h2>
                <p>Available Skill Points: {availableSkillPoints - totalSpentPoints}</p>
                {SKILL_LIST.map(skill => {
                    const modifier = calculateModifier(attributesCount[skill.attributeModifier]);
                    const total = skillPointsCount[skill.name] + modifier;
                    return (
                        <div key={skill.name} className="flex items-center gap-2 p-2 border-b">
                            <span className="w-40 font-bold">{skill.name}</span>
                            <span>Points: {skillPointsCount[skill.name]}</span>
                            <button onClick={() => handleSkillDecrement(skill.name)} className="px-2 py-1 bg-gray-300 rounded">-</button>
                            <button onClick={() => handleSkillIncrement(skill.name)} className="px-2 py-1 bg-gray-300 rounded">+</button>
                            <span className="ml-4 text-gray-700">Mod ({skill.attributeModifier}): {modifier}</span>
                            <span className="ml-4 font-bold">Total: {total}</span>
                        </div>
                    );
                })}
            </div>
        </>
      </section>
    </div>
  );
}

export default App;
