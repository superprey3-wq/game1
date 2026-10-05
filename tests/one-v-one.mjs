import test from 'node:test';
import assert from 'node:assert/strict';
import { GameRoom } from '../server/game.js';

test('1v1 room allows exactly two humans, one per side, and never creates bots', () => {
  const room = new GameRoom('DUEL01', {
    mode: 'defuse',
    bots: 9,
    maxHumans: 2,
    teamHumanLimit: 1,
    allowBots: false,
  });

  const first = room.addHuman({}, { name: 'Player 1', team: 'T' });
  const second = room.addHuman({}, { name: 'Player 2', team: 'auto' });

  assert.equal(first.team, 'T');
  assert.equal(second.team, 'CT');
  assert.equal(room.humanCount, 2);
  assert.equal(room.botCount, 0);
  assert.equal(room.desiredBots, 0);
  assert.equal(room.roomSeats().T.length, 1);
  assert.equal(room.roomSeats().CT.length, 1);

  assert.throws(
    () => room.addHuman({}, { name: 'Player 3', team: 'auto' }),
    /最多 2 名玩家/
  );
  assert.equal(room.setBots(first.id, 1).ok, false);
  room.ensureBots();
  assert.equal(room.botCount, 0);
});

test('1v1 rejects two human players on the same explicit side', () => {
  const room = new GameRoom('DUEL02', {
    mode: 'deathmatch',
    maxHumans: 2,
    teamHumanLimit: 1,
    allowBots: false,
  });
  room.addHuman({}, { name: 'T one', team: 'T' });
  assert.throws(
    () => room.addHuman({}, { name: 'T two', team: 'T' }),
    /只能有 1 名玩家/
  );
});
