-- Cleanup migration after String->Int ID transition.
-- Safe in both scenarios:
-- 1) Databases that still have legacy columns (id_old/projectId_old)
-- 2) Databases already recreated with Int IDs only

ALTER TABLE `projects`
  DROP COLUMN IF EXISTS `id_old`;

ALTER TABLE `tasks`
  DROP COLUMN IF EXISTS `id_old`,
  DROP COLUMN IF EXISTS `projectId_old`;

-- Remove temporary unique indexes if they remained after column swap.
DROP INDEX IF EXISTS `projects_id_new_key` ON `projects`;
DROP INDEX IF EXISTS `tasks_id_new_key` ON `tasks`;
