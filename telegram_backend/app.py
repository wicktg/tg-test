from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from telethon import TelegramClient
from telethon.tl.types import UserStatusOnline, UserStatusOffline
import asyncio
import threading

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

api_id = '16897600'  # Replace with your API ID
api_hash = 'fb17a18ce8630d5991563c45cc5ce25f'  # Replace with your API Hash
phone = '+918595497440'  # Your phone number

# Create the Telegram client
client = TelegramClient('session_name', api_id, api_hash)

@app.route('/get_user_status', methods=['GET'])
async def get_user_status():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400
    
    # Ensure client is started
    await client.start()
    try:
        # Fetch the user entity
        entity = await client.get_entity(username)
        status = entity.status
        last_seen_time = format_last_seen(status)
        return jsonify({
            "username": username,
            "last_seen": last_seen_time,
            "first_name": entity.first_name,
            "last_name": entity.last_name,
            "is_premium": entity.is_premium,
            "language_code": entity.language_code
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 404

def format_last_seen(status):
    """Format the user's last seen status into a human-readable string."""
    if status is None:
        return "never"
    elif isinstance(status, UserStatusOnline):
        return "now"
    elif isinstance(status, UserStatusOffline):
        return status.was_online.isoformat()  # Format as desired
    else:
        return "unknown status"

def run_flask():
    """Run the Flask application."""
    app.run(port=5000)

async def main():
    """Start the Telegram client."""
    await client.start()

if __name__ == '__main__':
    # Start the Flask app in a separate thread
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.start()

    # Run the Telegram client in the main thread
    asyncio.run(main())
