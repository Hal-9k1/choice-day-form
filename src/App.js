import { useState } from 'react';

const MIME = 'application/x-choice-day-selection';
const PERIODS = 6;
const CHOICE_DATA = [
  {
    name: 'class 1',
    desc: 'desc 1',
    periods: [1],
  },
  {
    name: 'class 2',
    desc: 'desc 2',
    periods: [1],
  },
  {
    name: 'class 3',
    desc: 'desc 3',
    periods: [2],
  },
];

function getDefaultChoices() {
  return Array(PERIODS).fill(null).map((_, i) =>
    CHOICE_DATA.filter(choice => choice.periods.includes(i))
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

export default function App() {
  const [choices, setChoices] = useState(getDefaultChoices);
  const [selected, setSelected] = useState(1);
  const [transferring, setTransferring] = useState(null);

  const onDragStart = (i, e) => {
    e.dataTransfer.setData(MIME, i);
    e.dataTransfer.dropEffect = 'move';
    setTransferring(i);
  };

  const onDragOver = (i, e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (i, e) => {
    e.preventDefault();
    console.log(choices[selected]);
    setChoices(choices.with(selected, choices[selected]
      .with(i, choices[selected][e.dataTransfer.getData(MIME)])
      .with(e.dataTransfer.getData(MIME), choices[selected][i])
    ));
  };
  return (
    <div className='App'>
      <div className='App-intro'>
        <p>Rank your class selection for Choice Day!</p>
        <ul>
          <li>
            You will only be enrolled into a class one time, even if it&apos;s offered for multiple
            periods.
          </li>
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
              onClick={() => setSelected(i + 1)}
              key={`key-${i}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className='App-col App-ranking'>
          <div className='App-table-header'>Ranking</div>
          <div className='App-ranking-body'>
            {choices[selected].map((choice, i) => (
              <div
                className={
                  `App-ranking-tile${transferring === i ? ' App-ranking-transferring' : ''}`
                }
                onDragOver={e => onDragOver(i, e)}
                onDrop={e => onDrop(i, e)}
                key={`key-${i}`}
              >
                <div
                  className='App-ranking-data'
                  onDragStart={e => onDragStart(i, e)}
                  draggable={true}
                >
                  <div className='App-ranking-title'>{getOrdinal(i + 1)} choice: {choice.name}</div>
                  <div className='App-ranking-desc'>{choice.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
