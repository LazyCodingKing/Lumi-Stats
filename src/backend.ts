import type { SpindleAPI } from 'lumiverse-spindle-types';
import { LumiStatsService } from './backend/service';

declare const spindle: SpindleAPI;

const stop = new LumiStatsService(spindle).start();

export function teardown(): void {
  stop();
}
