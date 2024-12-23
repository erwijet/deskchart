import { Paper, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

import { trpc } from '~router'

export const Route = createFileRoute('/_auth/home')({
  component: RouteComponent,
  loader: ({ context: { trpcQueryUtils } }) => {
    trpcQueryUtils.classroom.list.ensureData()
  },
})

function RouteComponent() {
  const [classrooms] = trpc.classroom.list.useSuspenseQuery()

  return (
    <div>
      {classrooms.map((classroom) => (
        <Paper key={classroom.id}>
          <Title order={5}>{classroom.title}</Title>
          <pre>{classroom.description}</pre>
        </Paper>
      ))}
    </div>
  )
}
