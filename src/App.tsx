import { useEffect, useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';

type AttributesCount = { [key: string]: number };
const GITHUB_USER = "{{arpitbhatia}}}";
const API_URL = `https://recruiting.verylongdomaintotestwith.ca/api/${GITHUB_USER}/character`;
const MAX_ATTRIBUTE_TOTAL = 70;

type Character = {
  id: number;
  name: string;
  attributes: AttributesCount;
  skillPoints: Record<string, number>;
  selectedClass: string | null;
};

function App() {

  const [characters, setCharacters] = useState<Character[]>([]);


  // const [attributesCount, setAttributesCount] = useState(
  //   ATTRIBUTE_LIST.reduce((att, item) => {
  //     att[item] = 10;
  //     return att;
  //   }, {} as AttributesCount)
  // );

  // const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // const [skillPointsCount, setSkillPointsCount] = useState<Record<string, number>>(
  //   SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {})
  // );

  useEffect(() => {
    console.log(API_URL);
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // if (data.attributes) setAttributesCount(data.attributes);
            // if (data.skillPoints) setSkillPointsCount(data.skillPoints);
            // if (data.selectedClass) setSelectedClass(data.selectedClass);
            if(data && typeof data.body === "object"){
                setCharacters(Object.values(data.body));
              }else{ 
                setCharacters([]);
              }
            console.log(characters);
        })
        .catch(console.error);
  }, [characters]);

  const saveCharacters = () => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(characters),
    }).catch(console.error);
  };

  const calculateModifier = (value: number) => {
    return Math.floor((value - 10) / 2);
  };

  // const availableSkillPoints = 10 + 4 * calculateModifier(attributesCount.Intelligence);
  // const totalSpentPoints = Object.values(skillPointsCount).reduce((sum, points) => sum + points, 0);
  // const totalAttributePoints = Object.values(attributesCount).reduce((sum, val) => sum + val, 0);

  const handleAttributeChange = (charId: number, attr: string, delta: number) => {
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id === charId) {
          const totalAttributes = Object.values(char.attributes).reduce(
            (sum, val) => sum + val,
            0
          );
          if (totalAttributes + delta > MAX_ATTRIBUTE_TOTAL) return char;

          return {
            ...char,
            attributes: {
              ...char.attributes,
              [attr]: Math.max(0, char.attributes[attr] + delta),
            },
          };
        }
        return char;
      })
    );
    saveCharacters();
  };

  const handleSkillChange = (charId: number, skill: string, delta: number) => {
    setCharacters((prev) =>
      prev.map((char) => {
        if (char.id === charId) {
          const availablePoints =
            10 + 4 * calculateModifier(char.attributes.Intelligence);
          const spentPoints = Object.values(char.skillPoints).reduce(
            (sum, points) => sum + points,
            0
          );

          if (spentPoints + delta > availablePoints) return char;

          return {
            ...char,
            skillPoints: {
              ...char.skillPoints,
              [skill]: Math.max(0, char.skillPoints[skill] + delta),
            },
          };
        }
        return char;
      })
    );
    saveCharacters();
  };

  const handleAddCharacter = () => {
    const newCharacter: Character = {
      id: Date.now(),
      name: `Character ${characters.length + 1}`,
      attributes: ATTRIBUTE_LIST.reduce(
        (acc, attr) => ({ ...acc, [attr]: 10 }),
        {} as AttributesCount
      ),
      skillPoints: SKILL_LIST.reduce(
        (acc, skill) => ({ ...acc, [skill.name]: 0 }),
        {}
      ),
      selectedClass: null,
    };
    setCharacters((prev) => [...prev, newCharacter]);
    saveCharacters();
  };

  const handleRemoveCharacter = (charId: number) => {
    setCharacters((prev) => prev.filter((char) => char.id !== charId));
    saveCharacters();
  };

  // const handleIncrement = (attr: string) => {
  //   if (totalAttributePoints < MAX_ATTRIBUTE_TOTAL) {
  //     setAttributesCount(prev => {
  //       const updated = { ...prev, [attr]: prev[attr] + 1 }
  //       saveCharacter();
  //       return updated;
  //     });
  //   };
  // };
  
  // const handleDecrement = (attr: string) => {
  //     setAttributesCount(prev => { 
  //       const updated = { ...prev, [attr]: Math.max(0, prev[attr] - 1) };
  //       saveCharacter();
  //       return updated;
  //   });
  // };
  
  // const handleSkillIncrement = (skill: string) => {
  //   if (totalSpentPoints < availableSkillPoints) {
  //      setSkillPointsCount(prev => {
  //       const updated = { ...prev, [skill]: prev[skill] + 1 };
  //       saveCharacter();
  //       return updated;
  //   });
  // };
  // };
  
  // const handleSkillDecrement = (skill: string) => {
  //   setSkillPointsCount(prev => {
  //     const updated = { ...prev, [skill]: Math.max(0, prev[skill] - 1) };
  //     saveCharacter();
  //     return updated;
  //   });
  // };
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <>
        <button onClick={handleAddCharacter}>Add Character</button>
        {Array.isArray(characters) && characters.map((char) => (
          <div key={char.id} className="character-card">
            <h2>{char.name}</h2>
            <button onClick={() => handleRemoveCharacter(char.id)}>Remove</button>

            <div>
              <b>Attributes</b>
              {ATTRIBUTE_LIST.map((attr) => (
                <div key={attr}>
                  <p>
                    {attr}: {char.attributes[attr]} (Mod:{" "}
                    {calculateModifier(char.attributes[attr])})
                  </p>
                  <button onClick={() => handleAttributeChange(char.id, attr, 1)}>
                    +
                  </button>
                  <button onClick={() => handleAttributeChange(char.id, attr, -1)}>
                    -
                  </button>
                </div>
              ))}
            </div>

            <div>
              <b>Classes</b>
              {Object.keys(CLASS_LIST).map((className) => (
                <div key={className} onClick={() =>
                    setCharacters((prev) =>
                      prev.map((c) =>
                        c.id === char.id ? { ...c, selectedClass: className } : c
                      )
                    )
                  }>
                  {className}
                </div>
              ))}
            </div>

            {char.selectedClass && (
              <div>
                <b>Class selected: {char.selectedClass}</b>
                <ul>
                  {Object.entries(CLASS_LIST[char.selectedClass] || {}).map(
                    ([attr, value]) => (
                      <li key={attr}>
                        {attr}: {value}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            <div className="mt-4">
              <h2>Skills</h2>
              <p>
                Available Skill Points:{" "}
                {10 + 4 * calculateModifier(char.attributes.Intelligence) -
                  Object.values(char.skillPoints).reduce((sum, val) => sum + val, 0)}
              </p>
              {SKILL_LIST.map((skill) => {
                const modifier = calculateModifier(
                  char.attributes[skill.attributeModifier]
                );
                const total = char.skillPoints[skill.name] + modifier;
                return (
                  <div key={skill.name} className="skill-row">
                    <span>{skill.name}</span>
                    <span>Points: {char.skillPoints[skill.name]}</span>
                    <button
                      onClick={() => handleSkillChange(char.id, skill.name, -1)}
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleSkillChange(char.id, skill.name, 1)}
                    >
                      +
                    </button>
                    <span>Mod ({skill.attributeModifier}): {modifier}</span>
                    <span>Total: {total}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
          
        </>
      </section>
    </div>
  );
}

export default App;
{/* <div><b>Attributes</b>{ATTRIBUTE_LIST.map((item) => {
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
          </div> */}
          {/* {selectedClass && CLASS_LIST[selectedClass] && (
            <div> <b>Class selected:  {selectedClass}</b>
              <ul>
                {Object.entries(CLASS_LIST[selectedClass] || {}).map(([attr, value]) => (
                  <li key={attr}>
                    {attr}: {value}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
          {/* <div className="mt-4">
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
            </div> */}