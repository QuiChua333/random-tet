export interface WheelNumber {
  value: number; // 1-33
  color: string; // Alternating colors for visual variety
  textColor: string; // Text color for contrast
}

// Generate 33 numbers with vibrant multi-color palette
// Generate numbers with alternating red and cream colors
// If initialValues provided, use those numbers. Otherwise default to 1-33.
export function generateNumbers(initialValues?: number[]): WheelNumber[] {
  const red = '#ef4444';
  const cream = '#FFFDD0';

  const values = initialValues || Array.from({ length: 33 }, (_, i) => i + 1);

  return values.map((value, i) => ({
    value,
    color: i % 2 === 0 ? red : cream,
    textColor: i % 2 === 0 ? cream : red,
  }));
}

// Select random number from remaining numbers
export function selectRandomNumber(remainingNumbers: WheelNumber[]): WheelNumber {
  const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
  return remainingNumbers[randomIndex];
}

// Calculate rotation to land on specific number
export function calculateRotation(
  selectedValue: number, 
  remainingNumbers: WheelNumber[],
  currentRotation: number
): number {
  const totalNumbers = remainingNumbers.length;
  const segmentAngle = 360 / totalNumbers;
  
  // Find index of selected number in remaining numbers
  const targetIndex = remainingNumbers.findIndex(n => n.value === selectedValue);
  
  // Calculate the angle to the CENTER of the target segment
  const prizeCenter = (targetIndex * segmentAngle) + (segmentAngle / 2);
  
  // We want to land such that (prizeCenter + finalRotation) % 360 === 0
  // because 0 degrees is the pointer position (top)
  
  // 1. Calculate the rotation we want to add for spinning effect (e.g. 5 full spins)
  const spinAddition = 360 * 5;
  
  // 2. Calculate a tentative target based on current rotation + spin
  const tentativeRotation = currentRotation + spinAddition;
  
  // 3. Calculate the current alignment of the prize at this tentative rotation
  // We use ((a % n) + n) % n to handle negative numbers correctly in JS
  const currentAlignment = ((prizeCenter + tentativeRotation) % 360 + 360) % 360;
  
  // 4. Subtract the misalignment to align perfectly to 0
  // If currentAlignment is 10, we subtract 10.
  // If currentAlignment is 350, we subtract 350.
  // This ensures (prizeCenter + result) % 360 === 0.
  const finalRotation = tentativeRotation - currentAlignment;
  
  return finalRotation;
}


// Shuffle remaining numbers and re-assign colors
export function shuffleAndRecolor(numbers: WheelNumber[]): WheelNumber[] {
  // Extract values
  const values = numbers.map(n => n.value);
  
  // Fisher-Yates shuffle
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  
  const red = '#ef4444';
  const cream = '#FFFDD0';

  // Reconstruct with new colors based on index
  return values.map((value, i) => ({
    value,
    color: i % 2 === 0 ? red : cream,
    textColor: i % 2 === 0 ? cream : red,
  }));
}
