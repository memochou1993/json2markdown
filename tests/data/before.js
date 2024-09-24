export default {
  '_ignored': {
    'foo': 'bar',
  },
  'heading_1': 'Hello, World!',
  'list': [
    'foo',
    'bar',
    'baz',
  ],
  'nested': [
    {
      'heading_2': 'Hello, World!',
      'list': [
        'foo',
        'bar',
        'baz',
      ],
      'nested': [
        {
          'heading_3': 'Hello, World!',
          'list': [
            'foo',
            'bar',
            'baz',
          ],
          'nested': [
            {
              'heading_4': 'Hello, World!',
              'list': [
                'foo',
                'bar',
                'baz',
              ],
              'nested': [
                {
                  'heading_5': 'Hello, World!',
                  'list': [
                    'foo',
                    'bar',
                    'baz',
                  ],
                  'nested': [
                    {
                      'heading_6': 'Hello, World!',
                      'list': [
                        'foo',
                        'bar',
                        'baz',
                      ],
                      'nested': [
                        {},
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  'code': '```\nconsole.log(\'Hello, World!\');\n```',
  'table': '| foo | bar | baz |\n| --- | --- | --- |\n| 1 | 2 | 3 |',
  'links': [
    'https://example.com',
    'https://example.com',
    'https://example.com',
  ],
  'unsupported': [
    [
      'foo',
      'bar',
      'baz',
    ],
  ],
};
