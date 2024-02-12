export function getGender(value: string) {
  switch (value) {
    case 'M':
      return 'Male';
    case 'F':
      return 'Female';

    default:
      return '';
  }
}
