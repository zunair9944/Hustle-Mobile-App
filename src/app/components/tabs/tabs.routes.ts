import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadComponent: () => import('./home/home.page').then(m => m.HomePage)
            },
            {
                path: 'feed',
                loadComponent: () => import('./feed/feed.page').then(m => m.FeedPage)
            },
            {
                path: 'profile',
                loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage)
            },
            {
                path: 'inbox',
                loadComponent: () => import('./inbox/inbox.page').then(m => m.InboxPage)
            },
            {
                path: '',
                redirectTo: '/tabs/home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'home/job-details',
        loadComponent: () => import('./home/job-details/job-details.page').then(m => m.JobDetailsPage)
    },
    {
        path: 'profile/update',
        loadComponent: () => import('./profile/edit-profile/edit-profile.page').then(m => m.EditProfilePage)
    },
    {
        path: 'chat',
        loadComponent: () => import('./inbox/chat/chat.page').then(m => m.ChatPage)
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    },
    {
        path: 'profile/my-posts',
        loadComponent: () => import('./profile/my-posts/my-posts.page').then(m => m.MyPostsPage)
    },
    {
        path: 'comment-section',
        loadComponent: () => import('./feed/comment-section/comment-section.page').then(m => m.CommentSectionPage)
    },








]

