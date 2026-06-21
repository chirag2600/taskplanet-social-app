import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Collapse,
  Chip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { getAvatarUrl, formatTimeAgo } from '../utils/helpers';
import EditPostDialog from './EditPostDialog';

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

export default function PostCard({ post, onUpdate, onDelete }) {
  const { user, isAuthenticated } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = user?.username === post.username;
  const isLiked = user && post.likes?.includes(user.username);
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  const handleLike = async () => {
    if (!isAuthenticated) {
      showSnackbar('Sign in to like posts', 'info');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      onUpdate(data.post);
    } catch {
      showSnackbar('Failed to update like', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!isAuthenticated) {
      showSnackbar('Sign in to comment', 'info');
      return;
    }
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comments`, { text: commentText.trim() });
      setCommentText('');
      setShowComments(true);
      onUpdate(data.post);
      showSnackbar('Comment added', 'success');
    } catch {
      showSnackbar('Failed to add comment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete?.(post._id);
      setDeleteOpen(false);
    } catch {
      showSnackbar('Failed to delete post', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
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
                  <Chip label="3 Gold" size="small" sx={{ height: 20, fontSize: 10 }} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  @{post.username} · {formatTimeAgo(post.createdAt)}
                </Typography>
              </Box>
            </Box>

            {isOwner && (
              <>
                <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null);
                      setEditOpen(true);
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null);
                      setDeleteOpen(true);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Delete
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton size="small" onClick={handleLike} disabled={loading} color={isLiked ? 'error' : 'default'}>
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
          </Box>

          <Collapse in={showComments || commentCount > 0}>
            <Box sx={{ mt: 2 }}>
              {post.comments?.map((comment, idx) => (
                <Box key={comment._id || idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Avatar src={getAvatarUrl(comment.username, 32)} sx={{ width: 28, height: 28 }} />
                  <Box sx={{ bgcolor: 'action.hover', borderRadius: 3, px: 1.5, py: 0.75, flex: 1 }}>
                    <Typography variant="caption" fontWeight={700} display="block">
                      @{comment.username}
                    </Typography>
                    <Typography variant="body2">{comment.text}</Typography>
                  </Box>
                </Box>
              ))}

              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder={isAuthenticated ? 'Write a comment...' : 'Sign in to comment'}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                  disabled={!isAuthenticated}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 999 } }}
                />
                <Button variant="contained" size="small" onClick={handleComment} disabled={loading || !isAuthenticated}>
                  Send
                </Button>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      <EditPostDialog
        post={post}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={(updated) => {
          onUpdate(updated);
          showSnackbar('Post updated', 'success');
        }}
      />

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Post?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
