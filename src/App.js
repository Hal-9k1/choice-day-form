import { useState, useCallback, useEffect } from 'react';
import 'drag-drop-touch';
import { createChoices, getSubmitData, getOrdinal, shouldUseWhiteText } from './utils.js';
import CHOICE_DATA from './choiceData.json';
import consts from './consts.js';
import './App.css';

export default function App() {
  const [choices, setChoices] = useState(createChoices);
  const [selected, setSelected] = useState(0);
  const [transferring, setTransferring] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropRefCount, setDropRefCount] = useState(0);

  const submitHref = 'mailto:edimea211@ausdg.us?subject=choice%20day%20response&body='
    + encodeURI(getSubmitData(choices));

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
    e.dataTransfer.setData(consts.MIME, '' + i);
    e.dataTransfer.dropEffect = 'move';
    setTransferring(i);
    if (dropTarget === i) {
      setDropTarget(null);
    }
  };

  const onDragOver = (i, e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDragEnter = (i, e) => {
    if (e.dataTransfer.types.includes(consts.MIME) && transferring !== null && i !== transferring) {
      setDropRefCount(n => {
        const m = n + 1;
        setDropTarget(i);
        return m;
      });
    }
  };

  const onDragLeave = (i, e) => {
    if (e.dataTransfer.types.includes(consts.MIME) && transferring !== null && i !== transferring) {
      setDropRefCount(n => {
        const m = n - 1;
        if (m < 1) {
          setDropTarget(null);
        }
        return m;
      });
    }
  };

  const onDrop = (i, e) => {
    e.preventDefault();
    onDragEnd();
    const srcIdx = parseInt(e.dataTransfer.getData(consts.MIME));
    if (Number.isFinite(srcIdx)) {
      setChoices(choices.with(selected, choices[selected]
        .with(i, choices[selected][srcIdx])
        .with(srcIdx, choices[selected][i])
      ));
    }
  };
  return (
    <div className='App'>
      <div className='App-intro'>
        <h1>ASTI Choice Day 2025 class selection</h1>
        <p>Rank your class selection for Choice Day!</p>
        <ul>
          <li>
            Click on each period, then reorder the class choices by dragging them so your more
            preferred classes for that period are on top.
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
          {Array(consts.PERIODS).fill(null).map((_, i) => (
            <button
              className={'App-table-row'
                + (i % 2 ? ' App-table-row-alt' : '')
                + (i === selected ? ' App-table-row-selected' : '')
              }
              onClick={() => setSelected(i)}
              type='button'
              key={`key-${i}`} // Content of the element IS the index
            >
              {i + 1}
            </button>
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
                key={CHOICE_DATA.indexOf(choice)}
              >
                <div
                  className='App-ranking-data'
                  onDragStart={e => onDragStart(i, e)}
                  draggable={true}
                >
                  <div className='App-ranking-title'>{getOrdinal(i + 1)} choice: {choice.name}</div>
                  <div className='App-ranking-desc'>{choice.desc.split('\n').map(line => (
                    <p key={line}>{line}</p>
                  ))}</div>
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
