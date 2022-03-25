type InterpolationConfig = {
  input: number[];
  output: number[];
};

export function interpolate(value: number, config: InterpolationConfig) {
  const { input, output } = config;
  const newValue = ((value - input[0]) * (output[1] - output[0])) / (input[1] - input[0]) + output[0];
  return Math.min(Math.max(newValue, output[0]), output[1]);
}
