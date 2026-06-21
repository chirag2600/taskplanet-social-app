import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  IconButton,
  TextField,
  Collapse,
  Chip,
  Divider,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, formatTimeAgo } from '../utils/helpers';

function HashtagText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\#\w+)/g);
  return (
    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, mb: 1.5 }}>
      {parts.map((part, i) =>
        part.startsWith('#') ? (
          <Box component="span" key={i} sx={{ color: 'primary.main', fontWeight: 500 }}>
            {part}
          </Box>
        ) : (
          part
        )
      )}
    </Typography>
  );
}

export default function PostCard({ post, onUpdate }) {
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLiked = user && post.likes?.includes(user.username);
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  const handleLike = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      onUpdate(data.post);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comments`, { text: commentText.trim() });
      setCommentText('');
      setShowComments(true);
      onUpdate(data.post);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        {/* User header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Avatar
              src={post.profilePic || getAvatarUrl(post.username)}
              alt={post.username}
              sx={{ width: 44, height: 44 }}
            />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {post.username}
                </Typography>
                <Chip label="3 Gold" size="small" sx={{ height: 20, fontSize: 10, bgcolor: '#fef3c7' }} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                @{post.username} · {formatTimeAgo(post.createdAt)}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="small"
            sx={{ minWidth: 72, py: 0.5, fontSize: 12, boxShadow: 'none' }}
          >
            Follow
          </Button>
        </Box>

        {/* Post content */}
        <HashtagText text={post.text} />

        {post.imageUrl && (
          <Box
            component="img"
            src={post.imageUrl}
            alt="Post"
            sx={{ width: '100%', borderRadius: 3, mb: 1.5, maxHeight: 400, objectFit: 'cover' }}
          />
        )}

        <Divider sx={{ my: 1.5 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={handleLike}
                disabled={loading || !isAuthenticated}
                color={isLiked ? 'error' : 'default'}
              >
                {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
              <Typography variant="caption" fontWeight={600}>
                {likeCount}
              </Typography>
            </Box>

            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
              onClick={() => setShowComments((v) => !v)}
            >
              <IconButton size="small">
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" fontWeight={600}>
                {commentCount}
              </Typography>
            </Box>

            <IconButton size="small">
              <BookmarkBorderIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Comments section */}
        <Collapse in={showComments || commentCount > 0}>
          <Box sx={{ mt: 2 }}>
            {post.comments?.map((comment, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Avatar
                  src={getAvatarUrl(comment.username, 32)}
                  sx={{ width: 28, height: 28 }}
                />
                <Box sx={{ bgcolor: '#f3f4f6', borderRadius: 3, px: 1.5, py: 0.75, flex: 1 }}>
                  <Typography variant="caption" fontWeight={700} display="block">
                    @{comment.username}
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
              </Box>
            ))}

            {isAuthenticated && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 999 } }}
                />
                <Button variant="contained" size="small" onClick={handleComment} disabled={loading}>
                  Send
                </Button>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
