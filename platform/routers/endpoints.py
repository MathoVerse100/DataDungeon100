from routers.auth.endpoints import paths as auth_paths
from routers.home.endpoints import paths as home_paths
from routers.communities.endpoints import paths as communities_paths
from routers.university.endpoints import paths as university_paths
from routers.projects.endpoints import paths as projects_paths
from routers.storage.endpoints import paths as storage_paths
from routers.settings.endpoints import paths as settings_paths
from routers.profile.endpoints import paths as profile_paths
from routers.find_people.endpoints import paths as find_people_paths
from routers.monk.endpoints import paths as monk_paths
from routers.library.endpoints import paths as library_paths
from routers.study_zone.endpoints import paths as study_zone_paths
from routers.tos.endpoints import paths as tos_paths
from routers.history.endpoints import paths as history_paths
from routers.help.endpoints import paths as help_paths
from routers.explore.endpoints import paths as explore_paths


paths = [
    *auth_paths,
    *home_paths,
    *communities_paths,
    *university_paths,
    *projects_paths,
    *storage_paths,
    *settings_paths,
    *profile_paths,
    *find_people_paths,
    *monk_paths,
    *library_paths,
    *study_zone_paths,
    *tos_paths,
    *history_paths,
    *help_paths,
    *explore_paths,
]