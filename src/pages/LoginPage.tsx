import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Stack, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '../store/api/apiSlice';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@enterprise.com', password: 'password123' },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setError(null);
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
    } catch (err: any) {
      setError(err?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F0F4F8', p: 2 }}>
      <Card sx={{ maxWidth: 420, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center">
            <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LockOutlined sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={700} color="text.primary">IT Service Desk</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>Enterprise Ticket Management System</Typography>
            </Box>
          </Stack>

          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Stack spacing={2.5}>
              <TextField
                {...register('email')}
                label="Email Address"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
              />
              <TextField
                {...register('password')}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading} sx={{ py: 1.5, mt: 1 }}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>Demo Accounts:</Typography>
            <Typography variant="caption" color="text.secondary" component="div" sx={{ fontFamily: 'monospace', fontSize: '11px' }}>
              admin@enterprise.com / password123<br/>
              manager@enterprise.com / password123<br/>
              reviewer@enterprise.com / password123<br/>
              viewer@enterprise.com / password123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
