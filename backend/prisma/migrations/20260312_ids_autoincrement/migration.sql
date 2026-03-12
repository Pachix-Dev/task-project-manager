-- Non-destructive migration: convert String IDs to Int autoincrement while preserving rows.
-- Strategy:
-- 1) Add new numeric columns
-- 2) Backfill FK mapping
-- 3) Swap PK/FK columns

SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE `projects`
  ADD COLUMN `id_new` INT NULL AUTO_INCREMENT,
  ADD UNIQUE INDEX `projects_id_new_key` (`id_new`);

ALTER TABLE `tasks`
  ADD COLUMN `id_new` INT NULL AUTO_INCREMENT,
  ADD UNIQUE INDEX `tasks_id_new_key` (`id_new`),
  ADD COLUMN `projectId_new` INT NULL;

UPDATE `tasks` t
JOIN `projects` p ON p.`id` = t.`projectId`
SET t.`projectId_new` = p.`id_new`;

ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_projectId_fkey`;
DROP INDEX `tasks_projectId_idx` ON `tasks`;
DROP INDEX `tasks_projectId_status_idx` ON `tasks`;

ALTER TABLE `projects` DROP PRIMARY KEY;
ALTER TABLE `projects`
  CHANGE COLUMN `id` `id_old` VARCHAR(191) NOT NULL,
  CHANGE COLUMN `id_new` `id` INT NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tasks` DROP PRIMARY KEY;
ALTER TABLE `tasks`
  CHANGE COLUMN `id` `id_old` VARCHAR(191) NOT NULL,
  CHANGE COLUMN `id_new` `id` INT NOT NULL AUTO_INCREMENT,
  CHANGE COLUMN `projectId` `projectId_old` VARCHAR(191) NOT NULL,
  CHANGE COLUMN `projectId_new` `projectId` INT NOT NULL,
  ADD PRIMARY KEY (`id`);

CREATE INDEX `tasks_projectId_idx` ON `tasks` (`projectId`);
CREATE INDEX `tasks_projectId_status_idx` ON `tasks` (`projectId`, `status`);

ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_projectId_fkey`
  FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;
