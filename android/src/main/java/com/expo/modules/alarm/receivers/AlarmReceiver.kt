package com.expo.modules.alarm.receivers

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class AlarmReceiver : BroadcastReceiver() {
    companion object {
        private const val CHANNEL_ID = "alarm_channel"
        private const val CHANNEL_NAME = "Alarms"
        private const val CHANNEL_DESCRIPTION = "Notifications for scheduled alarms"
    }

    override fun onReceive(context: Context, intent: Intent) {
        val identifier = intent.getStringExtra("identifier") ?: return
        val title = intent.getStringExtra("title") ?: "Alarm"
        val body = intent.getStringExtra("body")
        val repeating = intent.getBooleanExtra("repeating", false)
        val repeatInterval = intent.getLongExtra("repeatInterval", 0L)
        val sound = intent.getStringExtra("sound")

        // Create notification channel (required for Android 8.0+)
        createNotificationChannel(context)

        // Build and show notification
        val notificationBuilder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setDefaults(NotificationCompat.DEFAULT_ALL)

        // Create dismiss action
        val dismissIntent = Intent(context, NotificationActionReceiver::class.java).apply {
            action = "DISMISS_ACTION"
            putExtra("identifier", identifier)
        }
        val dismissPendingIntent = PendingIntent.getBroadcast(
            context,
            identifier.hashCode(),
            dismissIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        notificationBuilder.addAction(
            android.R.drawable.ic_menu_close_clear_cancel,
            "Dismiss",
            dismissPendingIntent
        )

        // Create snooze action
        val snoozeIntent = Intent(context, NotificationActionReceiver::class.java).apply {
            action = "SNOOZE_ACTION"
            putExtra("identifier", identifier)
        }
        val snoozePendingIntent = PendingIntent.getBroadcast(
            context,
            identifier.hashCode() + 1,
            snoozeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        notificationBuilder.addAction(
            android.R.drawable.ic_media_play,
            "Snooze",
            snoozePendingIntent
        )

        val notificationManager = NotificationManagerCompat.from(context)
        notificationManager.notify(identifier.hashCode(), notificationBuilder.build())

        // TODO: Send event to React Native
        // This would require access to the React Native bridge, which is complex in a BroadcastReceiver
        // Consider using a service or other mechanism for event delivery
    }

    private fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(CHANNEL_ID, CHANNEL_NAME, importance).apply {
                description = CHANNEL_DESCRIPTION
                enableVibration(true)
                setShowBadge(true)
            }

            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
}