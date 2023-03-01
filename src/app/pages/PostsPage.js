import AnnoucementCard from "app/components/posts/AnnoucementCard"
import PostCard from "app/components/posts/PostCard"
import PostConsole from "app/components/posts/PostConsole"
import AppTabsBar from "app/components/ui/AppTabsBar"
import HelmetTitle from "app/components/ui/HelmetTitle"
import LikesStatsModal from "app/components/ui/LikesStatsModal"
import { useOrgAnnouncements, useOrgPosts } from "app/hooks/postsHooks"
import { StoreContext } from "app/store/store"
import React, { useContext, useState } from 'react'
import './styles/PostsPage.css'

export default function PostsPage() {

  const { myOrgID } = useContext(StoreContext)
  const limitsNum = 10
  const [postsLimit, setPostsLimit] = useState(limitsNum)
  const [announcesLimit, setAnnouncesLimit] = useState(limitsNum)
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [likesStats, setLikesStats] = useState([])
  const [showSavedModal, setShowSavedModal] = useState(false)
  const [savedStats, setSavedStats] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const posts = useOrgPosts(postsLimit)
  const announcements = useOrgAnnouncements(announcesLimit)

  const postsList = posts?.map((post, index) => {
    return <PostCard
      key={index}
      post={post}
      setLikesStats={setLikesStats}
      setShowLikesModal={setShowLikesModal}
      setShowSavedModal={setShowSavedModal}
      setSavedStats={setSavedStats}
    />
  })

  const announcementsList = announcements?.map((announcement, index) => {
    return <AnnoucementCard
      key={index}
      announcement={announcement}
      setLikesStats={setLikesStats}
      setShowLikesModal={setShowLikesModal}
    />
  })

  const loadMorePosts = () => {

  }

  return (
    <div className="posts-page">
      <HelmetTitle title="Posts" />
      <div className="posts-column">
        <AppTabsBar noSpread spacedOut={10}>
          <h6 
            className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <i className="fas fa-newspaper" />
            Posts
          </h6>
          <h6 
            className={`tab-item ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <i className="fas fa-bullhorn" />
            Announcements
          </h6>
        </AppTabsBar>
        <div className={`tab-section ${activeTab === 'posts' ? 'active' : ''}`}>
          <PostConsole
            title="Add a post"
            pathPrefix={`organizations/${myOrgID}/posts`}
            placeholder="Write a post"
          />
          <div className="posts-list">
            {postsList}
          </div>
        </div>
        <div className={`tab-section ${activeTab === 'announcements' ? 'active' : ''}`}>
          <PostConsole
            title="Add an announcement"
            pathPrefix={`organizations/${myOrgID}/announcements`}
            placeholder="Write an announcement"
          />
          <div className="posts-list">
            {announcementsList}
          </div>
        </div>
      </div>
      <div className="posts-sidebar">

      </div>
      <LikesStatsModal
        showModal={showLikesModal}
        setShowModal={setShowLikesModal}
        users={likesStats}
        label="Likes"
      />
      <LikesStatsModal
        showModal={showSavedModal}
        setShowModal={setShowSavedModal}
        users={savedStats}
        label="Saves"
      />
    </div>
  )
}
