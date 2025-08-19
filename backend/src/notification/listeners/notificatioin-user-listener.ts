import { Injectable } from "@nestjs/common";
import { NotificationService } from '../notification.service';
import PrismaService from "../../common/services/prisma.service";
import { OnEvent } from "@nestjs/event-emitter";
import { DOMAIN_EVENTS, NotificationMessages } from "../notification-constants";

@Injectable()
export class NotificationUserListener {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) { }

  @OnEvent(DOMAIN_EVENTS.FOLLOW_CREATED)
  async onFollowUser(payload: { sellerId: string; currentUser: string }) {
    await this.notificationService.createNotification({
      userId: payload.sellerId,
      message: NotificationMessages.FOLLOW_CREATED(payload.currentUser),
      metadata: JSON.stringify({ type: 'FOLLOW_CREATED', role: 'SELLER' })
    })
  }

  @OnEvent(DOMAIN_EVENTS.WARNING_CREATED)
  async onWarningUser(payload: { userId: string; warningCount: number }) {
    await this.notificationService.createNotification({
      userId: payload.userId,
      message: NotificationMessages.WARNING_CREATED(payload.warningCount),
      metadata: JSON.stringify({ type: 'WARNING_CREATED' })
    })
  }

  @OnEvent(DOMAIN_EVENTS.BAND)
  async onBanUser( payload: { userId: string } ) {
    await this.notificationService.createNotification({
      userId: payload.userId,
      message: NotificationMessages.BAND(payload.userId),
      metadata: JSON.stringify({ type: 'BAND' })
    })
  }

  @OnEvent(DOMAIN_EVENTS.UNBAND)
  async onUnBanUser( payload: { userId: string } ) {
    await this.notificationService.createNotification({
      userId: payload.userId,
      message: NotificationMessages.UNBAND(payload.userId),
      metadata: JSON.stringify({ type: 'UNBAND' })
    })
  }
}
