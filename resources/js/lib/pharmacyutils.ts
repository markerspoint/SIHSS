export const STANDARD_DOSAGES = [
    '500mg',
    '250mg',
    '100mg',
    '50mg',
    '20mg',
    '10mg',
    '5mg',
    '2mg',
    '125mg/5mL',
    '250mg/5mL',
    '100mg/5mL',
    '40mg',
    '20.5g/sachet',
    '100mcg/dose',
    '15mL',
    '10mL',
    '5mL',
];

export const getFullName = (
    first: string,
    middle: string | null,
    last: string,
    suffix: string | null
): string => {
    return [first, middle, last, suffix].filter(Boolean).join(' ');
};
