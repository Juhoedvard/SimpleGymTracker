-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `testUser` BOOLEAN NOT NULL DEFAULT false,
    `stripe_customer_id` VARCHAR(191) NULL,
    `stripe_subscription_id` VARCHAR(191) NULL,
    `stripe_price_id` VARCHAR(191) NULL,
    `stripe_current_period_end` DATETIME(3) NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_stripe_customer_id_key`(`stripe_customer_id`),
    UNIQUE INDEX `User_stripe_subscription_id_key`(`stripe_subscription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkOut` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finished` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `WorkOut_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SavedWorkout` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `SavedWorkout_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exercise` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gategory` VARCHAR(191) NOT NULL,
    `workoutId` VARCHAR(191) NULL,
    `savedWorkoutId` VARCHAR(191) NULL DEFAULT '',

    UNIQUE INDEX `Exercise_name_key`(`name`),
    INDEX `Exercise_savedWorkoutId_idx`(`savedWorkoutId`),
    INDEX `Exercise_workoutId_idx`(`workoutId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Set` (
    `id` VARCHAR(191) NOT NULL,
    `reps` INTEGER NOT NULL,
    `sets` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL DEFAULT 0,
    `exerciseId` VARCHAR(191) NOT NULL,

    INDEX `Set_exerciseId_idx`(`exerciseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutExercises` (
    `id` VARCHAR(191) NOT NULL,
    `workoutId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `exerciseId` VARCHAR(191) NOT NULL,
    `finished` BOOLEAN NOT NULL DEFAULT false,

    INDEX `WorkoutExercises_userId_idx`(`userId`),
    INDEX `WorkoutExercises_workoutId_idx`(`workoutId`),
    INDEX `WorkoutExercises_exerciseId_idx`(`exerciseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
