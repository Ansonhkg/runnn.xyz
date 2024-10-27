import { expect, test } from 'bun:test';
import { getValueFromResponse } from './utils';
test('getValueFromResponse should work', () => {
  const data = {
    users: [
      { id: 1, name: 'Alice', address: { city: 'Wonderland' } },
      { id: 2, name: 'Bob', address: { city: 'Builderland' } },
    ],
    meta: { totalUsers: 2 },
  };

  const result = getValueFromResponse('users[0].id', data);
  expect(result).toBe(1);

  const result2 = getValueFromResponse('users[1].name', data);
  expect(result2).toBe('Bob');

  const result3 = getValueFromResponse('meta.totalUsers', data);
  expect(result3).toBe(2);

  const result4 = getValueFromResponse('users[0].address.city', data);
  expect(result4).toBe('Wonderland');

  const result5 = getValueFromResponse('users[1].address.city', data);
  expect(result5).toBe('Builderland');

  const result6 = getValueFromResponse('users[0].name', data);
  expect(result6).toBe('Alice');
});
