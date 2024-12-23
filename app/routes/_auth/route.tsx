import { AppShell, Box, Burger, Container, Group, rem } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Brand } from 'shared/assets/Brand'
import { Navbar } from 'components/Navbar'
import { useIsMobile } from 'shared/hooks/useIsMobile'
import { qc, queries } from 'shared/query'
import { session } from 'shared/session'

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    const token = session.getToken()
    if (!token) throw redirect({ to: '/login' })
  },
  loader: async () => {
    await qc.ensureQueryData(queries.session())
  },
  component: Component,
})

function Component() {
  const [opened, { toggle }] = useDisclosure(false)
  const { isMobile } = useIsMobile()

  return (
    <AppShell
      header={{ height: 60, collapsed: !isMobile }}
      navbar={{
        width: rem(80),
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Box h="30px" w="30px">
            <Brand />
          </Box>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size={'lg'}>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
