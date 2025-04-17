import { useState } from 'react';
import ChoiceData from 'ChoiceData';
import Choice from 'Choice';

const CHOICE_DATA = [
  new ChoiceData('class 1', 'desc 1'),
  new ChoiceData('class 2', 'desc 2'),
  new ChoiceData('class 3', 'desc 3'),
];

function generateChoices() {
  return CHOICE_DATA.map(data => new Choice(data));
}

function App() {
  const [choices, setChoices] = useState(generateChoices);
  return (
    <div className='app'>

    </div>
  );
}
