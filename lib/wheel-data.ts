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

// Calculate rotation to land on specific number, influenced by force
// force: 0–1, controls how many extra spins and animation duration
export function calculateRotation(
  selectedValue: number, 
  remainingNumbers: WheelNumber[],
  currentRotation: number,
  force: number = 1
): { rotation: number; duration: number } {
  const totalNumbers = remainingNumbers.length;
  const segmentAngle = 360 / totalNumbers;
  
  // Clamp force between 0.1 and 1
  const clampedForce = Math.max(0.1, Math.min(1, force));

  // Find index of selected number in remaining numbers
  const targetIndex = remainingNumbers.findIndex(n => n.value === selectedValue);
  
  // Calculate the angle to the CENTER of the target segment
  const prizeCenter = (targetIndex * segmentAngle) + (segmentAngle / 2);
  
  // Force controls extra spin rotations: low force = 2 spins, max force = 15 spins
  const minSpins = 2;
  const maxSpins = 15;
  const spinCount = minSpins + (maxSpins - minSpins) * clampedForce;
  const spinAddition = 360 * spinCount;
  
  // Calculate tentative rotation
  const tentativeRotation = currentRotation + spinAddition;
  
  // Align to prize center
  const currentAlignment = ((prizeCenter + tentativeRotation) % 360 + 360) % 360;
  const finalRotation = tentativeRotation - currentAlignment;
  
  // Duration scales with force: low force ≈ 2.5s, max force ≈ 10s
  const minDuration = 2.5;
  const maxDuration = 10;
  const duration = minDuration + (maxDuration - minDuration) * clampedForce;

  return { rotation: finalRotation, duration };
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
