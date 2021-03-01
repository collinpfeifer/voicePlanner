// Adding zeros to seconds to look like realistic counter

export const addZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);
