export const spreadDefinitions = [
  {
    id: 'single',
    positions: ['Thông điệp']
  },
  {
    id: 'three',
    positions: ['Quá khứ', 'Hiện tại', 'Tương lai']
  },
  {
    id: 'celtic',
    positions: [
      'Tình huống hiện tại',
      'Thách thức',
      'Nền tảng',
      'Quá khứ gần',
      'Tiềm năng',
      'Tương lai gần',
      'Bản thân',
      'Môi trường',
      'Hy vọng và nỗi sợ',
      'Kết quả'
    ]
  }
];

export function getSpreadDefinition(spreadId) {
  return spreadDefinitions.find((spread) => spread.id === spreadId) ?? spreadDefinitions[0];
}
