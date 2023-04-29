

import { useState, useRef, useEffect } from 'react';

const other = () => {

};


const useTest = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  // const
  // let value = initialValue;

  const updateValue = (text) => {
    setValue(text);
  };

  return [value, updateValue];
  // const [val, setVal] = useState(initialValue);
  // const testingRef = useRef(0);
  // testingRef.current++;
  // const temp = val + testingRef.current;
  // return [testingRef.current, () => {
  //   console.log('dude');
  // }];
};

export default useTest;