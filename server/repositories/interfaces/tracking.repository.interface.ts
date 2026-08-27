import { TrackingEventEntity, FulfillmentStatus } from '../../types/index';

export interface ITrackingRepository {
  getEventsByOrderId(orderId: string): Promise<TrackingEventEntity[]>;
  addEvent(orderId: string, event: TrackingEventEntity): Promise<void>;
  updateLatestStatus(orderId: string, stage: FulfillmentStatus, location?: string): Promise<TrackingEventEntity[]>;
}
