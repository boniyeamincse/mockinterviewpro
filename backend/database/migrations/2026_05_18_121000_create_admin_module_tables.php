<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_approved')) {
                $table->boolean('is_approved')->default(true)->after('is_active');
                $table->index('is_approved');
            }
        });

        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'is_flagged')) {
                $table->boolean('is_flagged')->default(false)->after('status');
                $table->text('flag_reason')->nullable()->after('is_flagged');
                $table->index('is_flagged');
            }
        });

        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'is_disputed')) {
                $table->boolean('is_disputed')->default(false)->after('status');
                $table->text('admin_note')->nullable()->after('cancel_reason');
                $table->index('is_disputed');
            }
        });

        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'is_flagged')) {
                $table->boolean('is_flagged')->default(false)->after('trainer_reply');
                $table->index('is_flagged');
            }
        });

        if (!Schema::hasTable('admin_notes')) {
            Schema::create('admin_notes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
                $table->string('target_type');
                $table->unsignedBigInteger('target_id');
                $table->text('note');
                $table->timestamps();
                $table->index(['target_type', 'target_id']);
            });
        }

        if (!Schema::hasTable('admin_notifications')) {
            Schema::create('admin_notifications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
                $table->string('title');
                $table->text('message');
                $table->string('type')->default('info');
                $table->boolean('is_read')->default(false);
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
                $table->index(['admin_id', 'is_read']);
            });
        }

        if (!Schema::hasTable('broadcast_messages')) {
            Schema::create('broadcast_messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
                $table->string('target_role')->default('all');
                $table->string('title');
                $table->text('message');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('notification_logs')) {
            Schema::create('notification_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('admin_id')->nullable()->constrained('users')->nullOnDelete();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('channel')->default('in_app');
                $table->string('status')->default('sent');
                $table->text('message')->nullable();
                $table->timestamps();
                $table->index(['channel', 'status']);
            });
        }

        if (!Schema::hasTable('platform_settings')) {
            Schema::create('platform_settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->json('value')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('settings_audit_logs')) {
            Schema::create('settings_audit_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
                $table->string('setting_key');
                $table->json('old_value')->nullable();
                $table->json('new_value')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('settings_audit_logs');
        Schema::dropIfExists('platform_settings');
        Schema::dropIfExists('notification_logs');
        Schema::dropIfExists('broadcast_messages');
        Schema::dropIfExists('admin_notifications');
        Schema::dropIfExists('admin_notes');

        Schema::table('reviews', function (Blueprint $table) {
            $drop = [];
            if (Schema::hasColumn('reviews', 'is_flagged')) {
                $drop[] = 'is_flagged';
            }
            if (!empty($drop)) {
                $table->dropColumn($drop);
            }
        });

        Schema::table('bookings', function (Blueprint $table) {
            $drop = [];
            if (Schema::hasColumn('bookings', 'is_disputed')) {
                $drop[] = 'is_disputed';
            }
            if (Schema::hasColumn('bookings', 'admin_note')) {
                $drop[] = 'admin_note';
            }
            if (!empty($drop)) {
                $table->dropColumn($drop);
            }
        });

        Schema::table('events', function (Blueprint $table) {
            $drop = [];
            if (Schema::hasColumn('events', 'is_flagged')) {
                $drop[] = 'is_flagged';
            }
            if (Schema::hasColumn('events', 'flag_reason')) {
                $drop[] = 'flag_reason';
            }
            if (!empty($drop)) {
                $table->dropColumn($drop);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
        });
    }
};
