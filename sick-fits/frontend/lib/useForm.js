import { useState, useEffect, useMemo } from 'react';

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);

  const initialValues = useMemo(() => ({ ...initial }), [initial]);

  useEffect(() => {
    setInputs(initial);
  }, [initial, initialValues]);

  function handleChange(e) {
    let { value, name, type } = e?.target;
    if (type === 'number') {
      value = parseFloat(value);
    }
    if (type === 'file') {
      [value] = e?.target?.files;
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const stateEntries = Object.entries(initial).map(([key]) => [key, '']);
    const blankState = Object.fromEntries(stateEntries);
    setInputs(blankState);
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
