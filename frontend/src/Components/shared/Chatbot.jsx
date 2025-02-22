import React, { useState, useEffect, useRef } from 'react';
import { 
  IconButton, TextField, Box, Typography, Paper, 
  CircularProgress, Button, Avatar, Tooltip, Fade,
  useTheme, useMediaQuery, Zoom
} from '@mui/material';
import { 
  Send as SendIcon, 
  Close as CloseIcon, 
  SmartToy as BotIcon,
  Delete as DeleteIcon,
  NorthEast as ExpandIcon,
  Person as PersonIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to the bottom of the chatbox when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { sender: 'user', text: userMessage };
    setChatHistory((prev) => [...prev, newMessage]);
    setUserMessage(''); // Clear input field

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch AI response');
      }

      setTimeout(() => {
        const aiMessage = { sender: 'ai', text: data.response };
        setChatHistory((prev) => [...prev, aiMessage]);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setTimeout(() => {
        const errorMessage = { 
          sender: 'ai', 
          text: 'Sorry, something went wrong. Please try again.',
          isError: true
        };
        setChatHistory((prev) => [...prev, errorMessage]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setShowOptions(false);
  };

  const getChatboxDimensions = () => {
    if (isMobile) {
      return {
        width: '100%',
        height: '100%',
        bottom: 0,
        right: 0,
        borderRadius: 0,
      };
    }
    
    if (isExpanded) {
      return {
        width: '65%',
        height: '80%',
        bottom: '10%',
        right: '10%',
        borderRadius: 3,
      };
    }
    
    return {
      width: 380,
      height: 550,
      bottom: 24,
      right: 24,
      borderRadius: 3,
    };
  };

  return (
    <Box>
      {/* Floating Chatbot Button */}
      {!isOpen && (
        <Zoom in={!isOpen}>
          <Paper
            elevation={6}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              borderRadius: '50%',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <IconButton
              onClick={() => setIsOpen(true)}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                p: 2,
                '&:hover': { 
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              <BotIcon fontSize="large" />
            </IconButton>
          </Paper>
        </Zoom>
      )}

      {/* Chatbox */}
      {isOpen && (
        <Fade in={isOpen}>
          <Paper
            elevation={12}
            sx={{
              position: 'fixed',
              ...getChatboxDimensions(),
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Chatbox Header */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    mr: 1,
                    width: 36, 
                    height: 36 
                  }}
                >
                  <BotIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AI Assistant
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {loading ? 'Typing...' : 'Online'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {!isMobile && (
                  <Tooltip title={isExpanded ? "Minimize" : "Expand"}>
                    <IconButton 
                      size="small" 
                      onClick={() => setIsExpanded(!isExpanded)}
                      sx={{ color: 'rgba(255,255,255,0.85)' }}
                    >
                      <ExpandIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
                    </IconButton>
                  </Tooltip>
                )}
                
                <Tooltip title="More options">
                  <IconButton 
                    size="small" 
                    onClick={() => setShowOptions(!showOptions)}
                    sx={{ color: 'rgba(255,255,255,0.85)' }}
                  >
                    <MoreIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Close">
                  <IconButton 
                    size="small" 
                    onClick={() => setIsOpen(false)}
                    sx={{ color: 'rgba(255,255,255,0.85)' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            {/* Options Menu */}
            {showOptions && (
              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  p: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleClearChat}
                  color="error"
                  variant="text"
                  size="small"
                >
                  Clear conversation
                </Button>
              </Box>
            )}

            {/* Welcome Message */}
            {chatHistory.length === 0 && (
              <Box 
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  textAlign: 'center',
                  bgcolor: theme.palette.background.default,
                  height: '100%'
                }}
              >
                <Box 
                  component="div" 
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 0,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                >
                  <BotIcon sx={{ fontSize: 40, color: '#fff' }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  Welcome to AI Assistant
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: 400 }}>
                  I'm here to help answer your questions and assist with tasks. 
                  How can I help you today?
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                  {['Submit Feedback', 'File Complaint', 'Request Leave', 'Warden Contact', 'Today\'s Mess Menu'].map((suggestion) => (
                    <Button 
                      key={suggestion}
                      variant="outlined" 
                      size="small"
                      onClick={() => {
                        setUserMessage(suggestion);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      sx={{ 
                        borderRadius: 4,
                        px: 2,
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          bgcolor: 'rgba(0,0,0,0.03)'
                        }
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {/* Chatbox Messages */}
            {chatHistory.length > 0 && (
              <Box
                ref={chatBoxRef}
                sx={{
                  flexGrow: 1,
                  p: 2,
                  overflowY: 'auto',
                  backgroundColor: theme.palette.background.default,
                  backgroundImage: 'radial-gradient(rgba(0,0,0,0.02) 1px, transparent 0)',
                  backgroundSize: '20px 20px',
                }}
              >
                {chatHistory.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                      opacity: 1,
                      animation: '0.3s ease-in-out slideIn',
                      '@keyframes slideIn': {
                        from: {
                          opacity: 0,
                          transform: message.sender === 'user' 
                            ? 'translateX(20px)' 
                            : 'translateX(-20px)'
                        },
                        to: {
                          opacity: 1,
                          transform: 'translateX(0)'
                        }
                      }
                    }}
                  >
                    {message.sender === 'ai' && (
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.primary.main,
                          width: 32,
                          height: 32,
                          mr: 1,
                          mt: 0.5
                        }}
                      >
                        <BotIcon fontSize="small" />
                      </Avatar>
                    )}
                    
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 2,
                        borderRadius: message.sender === 'user' 
                          ? '18px 18px 0 18px'
                          : '18px 18px 18px 0',
                        backgroundColor: message.sender === 'user' 
                          ? theme.palette.primary.main
                          : message.isError
                            ? theme.palette.error.light
                            : theme.palette.grey[100],
                        color: message.sender === 'user' 
                          ? '#fff'
                          : message.isError
                            ? theme.palette.error.dark
                            : theme.palette.text.primary,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
                      }}
                    >
                      <ReactMarkdown 
                        components={{
                          p: ({node, ...props}) => <Typography variant="body1" {...props} />
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </Box>
                    
                    {message.sender === 'user' && (
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.grey[500],
                          width: 32, 
                          height: 32,
                          ml: 1,
                          mt: 0.5
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    )}
                  </Box>
                ))}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.primary.main,
                        width: 32,
                        height: 32,
                        mr: 1,
                        mt: 0.5
                      }}
                    >
                      <BotIcon fontSize="small" />
                    </Avatar>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '18px 18px 18px 0',
                        backgroundColor: theme.palette.grey[100],
                        boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <Box className="typing-dot" sx={{
                            width: 6,
                            height: 6,
                            backgroundColor: theme.palette.text.secondary,
                            borderRadius: '50%',
                            animation: 'typingAnimation 1.4s infinite',
                            animationDelay: '0s',
                            '@keyframes typingAnimation': {
                              '0%': { opacity: 0.2 },
                              '20%': { opacity: 1 },
                              '100%': { opacity: 0.2 }
                            }
                          }}></Box>
                          <Box className="typing-dot" sx={{
                            width: 6,
                            height: 6,
                            backgroundColor: theme.palette.text.secondary,
                            borderRadius: '50%',
                            animation: 'typingAnimation 1.4s infinite',
                            animationDelay: '0.2s'
                          }}></Box>
                          <Box className="typing-dot" sx={{
                            width: 6,
                            height: 6,
                            backgroundColor: theme.palette.text.secondary,
                            borderRadius: '50%',
                            animation: 'typingAnimation 1.4s infinite',
                            animationDelay: '0.4s'
                          }}></Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Chatbox Input */}
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type your message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={loading}
                inputRef={inputRef}
                multiline
                maxRows={3}
                InputProps={{
                  sx: {
                    borderRadius: 6,
                    backgroundColor: theme.palette.background.default,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.divider
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.light
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
              />
              <Box
                sx={{
                  ml: 1,
                  position: 'relative',
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}
              >
                <Zoom in={!loading}>
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!userMessage.trim() || loading}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': { backgroundColor: theme.palette.primary.dark },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.action.disabledBackground,
                        color: theme.palette.action.disabled
                      },
                      transition: 'all 0.2s ease-in-out',
                      transform: userMessage.trim() ? 'scale(1)' : 'scale(0.9)',
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Zoom>
                <Zoom in={loading}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  </Box>
                </Zoom>
              </Box>
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default Chatbot;