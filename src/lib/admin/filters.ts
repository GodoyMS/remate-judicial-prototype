/** Empty selection = no filter (match all) */
export function matchesMulti<T>(selected: T[], value: T): boolean {
  return selected.length === 0 || selected.includes(value);
}

export function toggleFilterValue<T>(selected: T[], value: T): T[] {
  return selected.includes(value)
    ? selected.filter((v) => v !== value)
    : [...selected, value];
}

export function countActiveFilters(flags: boolean[]): number {
  return flags.filter(Boolean).length;
}
