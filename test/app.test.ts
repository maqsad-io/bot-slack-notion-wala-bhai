import { Bot } from '../src/lib/bot';
import { NotionManager } from '../src/lib/notion';
import { SlackManager } from '../src/lib/slack';
import { StandUpManager } from '../src/lib/stand-up-manager';

test('all classes should be defined', () => {
  expect(Bot).toBeDefined();
  expect(NotionManager).toBeDefined();
  expect(SlackManager).toBeDefined();
  expect(StandUpManager).toBeDefined();
});
