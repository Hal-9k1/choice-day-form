import { useState, useCallback, useEffect } from 'react';
import 'drag-drop-touch';
import './App.css';

const MIME = 'application/x-choice-day-selection';
const PERIODS = 6;
const CHOICE_DATA = [
  {
    name: 'QiGong',
    desc: 'Introduction to QiGong: warm-ups, first 5 moves of Dayan QiGong, a sequence from the '
      + 'Eight Brocades, moving meditation.',
    periods: [1],
  },
  {
    name: 'Science Focus / Credit Recovery',
    desc: 'DESCRIPTION',
    periods: [1],
  },
  {
    name: 'Logic Games',
    desc: 'Variant sudoku and other logic games such as minesweeper.',
    periods: [1],
  },
  {
    name: 'Dalgona Coffee',
    desc: 'Come join the queens in making Dagona coffee, matcha, and fruit teas. You will learn '
      + 'how to whip up the most delectable coffee and then you get to DRINK ITT YUMM',
    periods: [1],
  },
  {
    name: 'Intro to Veganism',
    desc: 'Are you vegan curious? Come to learn about the many benefits about moving to an '
      + 'animal-free diet. Try food samples and learn a few vegan hacks.',
    periods: [1],
  },
  {
    name: 'Friendship Bracelet Making',
    desc: 'During this workshop leadership students will be leading an activity in making friendship '
      + 'bracelets out of embroidery string. Students will get the opportunity to follow along a beginner '
      + 'video to learn the basics in making a friendship bracelet. Students will be given enough time to '
      + 'complete their bracelet before moving onto another slightly more challenging bracelet pattern. '
      + 'Students can make as many bracelets as they want depending on the materials left over from the '
      + 'first bracelet.',
    periods: [2],
  },
  {
    name: 'Karaoke',
    desc: 'Sing your favorite songs with friends!',
    periods: [2, 3],
  },
  {
    name: 'Murder Mystery',
    desc: 'Presentation about a fictional local murder and using deductive techniques to solve the '
      + 'case.',
    periods: [2],
  },
  {
    name: 'Homeland Security guest speaker',
    desc: 'Special Agent Smith and her team present on homeland security, their career and '
      + 'education paths, and some famous cases they worked on.',
    periods: [2, 3, 4],
  },
  {
    name: 'Reffing & Basketball',
    desc: 'Come play basketball in the gym with trained referee Mr. Zalvala.',
    periods: [2, 3, 6],
  },
  {
    name: 'Orienteering & GIS mapping',
    desc: <>
      <p>
        First half: basics of orienteering (competitive navigation sport), reading orienteer's maps,
        navigation strategies.
      </p>
      <p>
        Second half: presentation on digital mapmaking and geographical information systems
        (GIS).
      </p>
    </>,
    periods: [2, 3],
  },
  {
    name: 'Mocktails',
    desc: 'Layering and mixing non-alcoholic drinks, in collaboration with Ms. Corbally.',
    periods: [3],
  },
  {
    name: 'Red Cross guest speaker',
    desc: 'Presentation, demonstration, and practice of first aid and CPR on dummies.',
    periods: [3, 4],
  },
  {
    name: 'Photography guest speaker',
    desc: 'Watch guest speaker Aliah\'s presentation on photography techniques and composition.',
    periods: [4],
  },
  {
    name: 'Elevating Ramen',
    desc: 'Play chopstick-practice games to win ingredients to elevate your ramen!',
    periods: [4],
  },
  {
    name: 'Robotics Engineering guest speaker',
    desc: 'Guest speaker Leo Chan discusses ',
    periods: [4],
  },
  {
    name: 'Volleyball & Basketball',
    desc: 'Players are sorted into teams and pitted against each other to test their athletic and '
      + 'teamwork abilities!',
    periods: [4],
  },
  {
    name: 'Social and Board Games',
    desc: 'Yahtzee, Scattergories, Would You Rather?, Apples to Apples, and similar.',
    periods: [5],
  },
  {
    name: 'Music Lessons',
    desc: 'Have you ever wanted to learn an instrument? Do you love music and want to make it your '
      + 'own? Do you want to play with other musicians? In this workshop we will break into small groups '
      + 'and learn new instruments. We have drums, guitars, basses, pianos, and more to learn. If you '
      + 'have ever wanted to learn any of these instruments then this workshop is your chance to '
      + 'start. by the end everyone will be able to play together and jam.',
    periods: [5],
  },
  {
    name: 'Youth Commissioner guest speaker',
    desc: 'Saran will discuss how she got involved in the community as a member of the League of Women Voters, the Youth Commisioner of California, as well as many other positions. She will then discuss the importance of getting involved as youth and how you can easily too.',
    periods: [5],
  },
  {
    name: 'Capture the Flag',
    desc: 'DESCRIPTION',
    periods: [5],
  },
  {
    name: 'Just Dance',
    desc: 'DESCRIPTION',
    periods: [5],
  },
  {
    name: 'Chemical Engineering guest speaker',
    desc: 'Professor Josh Hubbard will give specific insights on the field of battery innovation, and sustainability in chemistry as well as career and project prospects in the field. This will be followed by a 30 min experiment with colored fire.',
    periods: [6],
  },
  {
    name: 'Introduction to salt-water tanks',
    desc: 'Setting up and caring for a hobbyist salt-water fish tank.',
    periods: [6],
  },
  {
    name: 'Ultimate Frisbee',
    desc: 'Players are sorted into teams and pitted against each other to test their athletic and teamwork abilities!',
    periods: [6],
  },
];

function getDefaultChoices() {
  return Array(PERIODS).fill(null).map((_, i) =>
    CHOICE_DATA.filter(choice => choice.periods.includes(i + 1))
  );
}

function getOrdinal(num) {
  let suffix;
  if (num % 100 > 10 && num % 100 < 14) {
    suffix = 'th';
  } else if (num % 10 === 1) {
    suffix = 'st'
  } else if (num % 10 === 2) {
    suffix = 'nd';
  } else if (num % 10 === 3) {
    suffix = 'rd';
  } else {
    suffix = 'th';
  }
  return num + suffix;
}

function shouldUseWhiteText(hue) {
  const s = 1;
  const l = 0.5;
  const a = 0.5;
  const f = n => {
    const k = (n + hue / 30) % 12;
    return 0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  // https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
  console.log(hue, Math.sqrt(
    f(0) * f(0) * 0.241 +
    f(8) * f(8) * 0.691 +
    f(4) * f(4) * 0.068
  ));
  return Math.sqrt(
    f(0) * f(0) * 0.241 +
    f(8) * f(8) * 0.691 +
    f(4) * f(4) * 0.068
  ) < 0.45;
}

export default function App() {
  const [choices, setChoices] = useState(getDefaultChoices);
  const [selected, setSelected] = useState(0);
  const [transferring, setTransferring] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropRefCount, setDropRefCount] = useState(0);

  const submitHref = 'mailto:edimea211@ausdg.us?subject=choice%20day%20response&body='
    + encodeURI(choices.map(period => period.map(choice => CHOICE_DATA.indexOf(choice)).join(',')).join(';'));

  const onDragEnd = useCallback(() => {
    setTransferring(null);
    setDropTarget(null);
    setDropRefCount(0);
  }, []);

  useEffect(() => {
    window.addEventListener('dragend', onDragEnd);
    return () => window.removeEventListener('dragend', onDragEnd);
  }, []);

  const onDragStart = (i, e) => {
    e.dataTransfer.setData(MIME, i);
    e.dataTransfer.dropEffect = 'move';
    setTransferring(i);
  };

  const onDragOver = (i, e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDragEnter = (i, e) => {
    if (e.dataTransfer.types.includes(MIME) && i !== transferring) {
      setDropTarget(i);
      setDropRefCount(n => n + 1);
    }
  };

  const onDragLeave = (i, e) => {
    if (e.dataTransfer.types.includes(MIME) && i !== transferring) {
      setDropRefCount(n => {
        const m = n - 1;
        if (!m) {
          setDropTarget(null);
        }
        return m;
      });
    }
  };

  const onDrop = (i, e) => {
    e.preventDefault();
    setChoices(choices.with(selected, choices[selected]
      .with(i, choices[selected][e.dataTransfer.getData(MIME)])
      .with(e.dataTransfer.getData(MIME), choices[selected][i])
    ));
  };
  return (
    <div className='App'>
      <div className='App-intro'>
        <h1>ASTI Choice Day 2025 class selection</h1>
        <p>Rank your class selection for Choice Day!</p>
        <ul>
          <li>
            Click on each period, then reorder the class choices so your more preferred classes for
            that period are on top.
          </li>
          <li>
            Your highest ranked class preferences will be chosen where possible.
          </li>
          <li>
            We will try to give everyone at least one of their top choices.
          </li>
          <li>
            You will only be enrolled into a class one time, even if it&apos;s offered for multiple
            periods.
          </li>
          <li>
            If you submit the form more than once, only your first response will be counted.
          </li>
          <li>
            <strong>No transfers. Please do not ask.</strong>
          </li>
        </ul>
      </div>
      <div className='App-chooser'>
        <div className='App-col App-period'>
          <div className='App-table-header'>Period</div>
          {Array(PERIODS).fill(null).map((_, i) => (
            <div
              className={'App-table-row'
                + (i % 2 ? ' App-table-row-alt' : '')
                + (i === selected ? ' App-table-row-selected' : '')
              }
              onClick={() => setSelected(i)}
              key={`key-${i}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className='App-col App-ranking'>
          <div className='App-table-header'>Ranking</div>
          <div className='App-ranking-body'>
            {choices[selected].map((choice, i) => {
              const hue = CHOICE_DATA.indexOf(choice) * 3 % CHOICE_DATA.length / CHOICE_DATA.length * 360;
              return <div
                className={'App-ranking-tile'
                  + (transferring === i ? ' App-ranking-transferring' : '')
                  + (dropTarget === i ? ' App-ranking-drop-target' : '')
                }
                onDragEnter={e => onDragEnter(i, e)}
                onDragLeave={e => onDragLeave(i, e)}
                onDragOver={e => onDragOver(i, e)}
                onDrop={e => onDrop(i, e)}
                style={{
                  color: shouldUseWhiteText(hue) ? 'white' : 'black',
                  backgroundColor: `hsl(${hue}, 100%, 50%)`
                }}
                key={`key-${i}`}
              >
                <div
                  className='App-ranking-data'
                  onDragStart={e => onDragStart(i, e)}
                  draggable={true}
                >
                  <div className='App-ranking-title'>{getOrdinal(i + 1)} choice: {choice?.name}</div>
                  <div className='App-ranking-desc'>{choice.desc}</div>
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>
      <div className='App-control'>
        To submit your choices, click <a href={submitHref} target='_blank'>HERE</a> and send the email{' '}
        <strong>from your school account</strong>. Do not change the subject or body of the email.
      </div>
    </div>
  );
}
