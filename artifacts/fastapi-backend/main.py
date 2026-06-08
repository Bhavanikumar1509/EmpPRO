import subprocess
import sys
import os

# Start MySQL if not running
def ensure_mysql():
    import shutil
    data_dir = "/home/runner/workspace/.mysql/data"
    sock_dir = "/home/runner/workspace/.mysql/run"
    log_dir = "/home/runner/workspace/.mysql/logs"
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(sock_dir, exist_ok=True)
    os.makedirs(log_dir, exist_ok=True)

    sock_file = f"{sock_dir}/mysql.sock"
    pid_file = f"{sock_dir}/mysql.pid"

    # Check if MySQL is already running
    if os.path.exists(pid_file):
        try:
            with open(pid_file) as f:
                pid = int(f.read().strip())
            os.kill(pid, 0)
            print(f"MySQL already running (pid={pid})", flush=True)
            return
        except (ProcessLookupError, ValueError):
            pass

    # Check if datadir is initialized
    if not os.path.exists(os.path.join(data_dir, "mysql")):
        print("Initializing MySQL data directory...", flush=True)
        subprocess.run([
            "mysqld", "--initialize-insecure",
            f"--user={os.getenv('USER', 'runner')}",
            f"--datadir={data_dir}",
        ], check=True)

    print("Starting MySQL...", flush=True)
    subprocess.Popen([
        "mysqld",
        f"--user={os.getenv('USER', 'runner')}",
        f"--datadir={data_dir}",
        f"--socket={sock_file}",
        f"--pid-file={pid_file}",
        f"--log-error={log_dir}/error.log",
        "--port=3306",
    ])

    # Wait for MySQL to be ready
    import time
    for _ in range(30):
        time.sleep(1)
        if os.path.exists(sock_file):
            try:
                result = subprocess.run(
                    ["mysql", f"--socket={sock_file}", "-u", "root", "--password=", "-e", "SELECT 1;"],
                    capture_output=True, timeout=3
                )
                if result.returncode == 0:
                    print("MySQL is ready!", flush=True)
                    break
            except Exception:
                pass
    else:
        print("Warning: MySQL may not be ready yet", flush=True)


def setup_database():
    import pymysql
    sock = "/home/runner/workspace/.mysql/run/mysql.sock"
    try:
        conn = pymysql.connect(
            unix_socket=sock, user="root", password="",
        )
        with conn.cursor() as cur:
            cur.execute("CREATE DATABASE IF NOT EXISTS emp_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        conn.close()
        print("Database emp_pro ready", flush=True)
    except Exception as e:
        print(f"DB setup warning: {e}", flush=True)


if __name__ == "__main__":
    ensure_mysql()
    setup_database()

    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
