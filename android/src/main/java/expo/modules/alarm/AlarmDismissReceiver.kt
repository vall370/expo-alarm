package expo.modules.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationManagerCompat

class AlarmDismissReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val identifier = intent.getStringExtra("identifier") ?: return
        
        // Cancel the notification
        val notificationManager = NotificationManagerCompat.from(context)
        notificationManager.cancel(identifier.hashCode())
        
        // TODO: Send dismissal event to React Native
        // Similar to AlarmReceiver, this would need bridge access
    }
}