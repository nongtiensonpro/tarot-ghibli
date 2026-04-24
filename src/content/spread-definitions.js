export const spreadDefinitions = [
  {
    id: 'single',
    positions: ['Thong diep']
  },
  {
    id: 'three',
    positions: ['Qua khu', 'Hien tai', 'Tuong lai']
  },
  {
    id: 'celtic',
    positions: [
      'Tinh huong hien tai',
      'Thach thuc',
      'Nen tang',
      'Qua khu gan',
      'Tiem nang',
      'Tuong lai gan',
      'Ban than',
      'Moi truong',
      'Hy vong va noi so',
      'Ket qua'
    ]
  }
];

export function getSpreadDefinition(spreadId) {
  return spreadDefinitions.find((spread) => spread.id === spreadId) ?? spreadDefinitions[0];
}
