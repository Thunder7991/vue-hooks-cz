export interface optionsType {
  duration: number;
  onUpdate?: <T>(params: T) => void;
  onEnd?: () => void;
}
