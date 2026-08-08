import { useState } from 'react'
import { Container, Title, Text, Stack, Card, Group, Badge, Button, Transition, Grid, Table } from '@mantine/core'
import { IconCheck, IconExternalLink } from '@tabler/icons-react'
import { Dice3D } from '../components/CloneCraft/Dice3D'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

import { websites, teams as allTeamsRaw } from '../data/clonecraftData'

type EventStep = 'ROLL_TEAM_SITE' | 'COMPLETED'

interface Assignment {
  team: string
  website: string
}

export function CloneCraftEvent() {
  const navigate = useNavigate()
  const [step, setStep] = useState<EventStep>('ROLL_TEAM_SITE')
  
  const [currentRolls, setCurrentRolls] = useState<Assignment[]>([])

  const handleRoll1Complete = async (_result: number) => {
    try {
      // Read saved assignments from Supabase
      const { data: stored, error: fetchError } = await supabase
        .from('clonecraft_assignments')
        .select('*')
      
      if (fetchError) throw fetchError

      const savedAssignments: Assignment[] = stored || []
      const initialTeams = [
        "Vynex IoT", "Tech Titans", "Lumina", "Hacker1.o",
        "Code Fusion ", "Aura Tech", "TechAsian ", "Decoder universe",
        "Shift", "CodeGPT", "TechZack", "Tech code", "Achivers", "Groot",
        "Team Spark", "RCB", "snacks"
      ]
      const allTeams = Array.from(new Set(allTeamsRaw))
      
      // We need to keep track of assignments as we make them in this loop
      let currentSaved = [...savedAssignments]
      const newRolls: Assignment[] = []

      for (let i = 0; i < 10; i++) {
        const assignedTeamNames = new Set(currentSaved.map(a => a.team))
        let unassignedTeams = allTeams.filter(t => !assignedTeamNames.has(t))

        if (unassignedTeams.length === 0) {
          if (i === 0) alert("All teams have been assigned!")
          break // Stop if no teams left
        }

        const randomTeam = unassignedTeams[Math.floor(Math.random() * unassignedTeams.length)]

        const websiteUsage: Record<string, number> = {}
        websites.forEach(w => websiteUsage[w] = 0)
        currentSaved.forEach(a => {
          if (websiteUsage[a.website] !== undefined) {
            websiteUsage[a.website]++
          }
        })

        const availableWebsites = websites.filter(w => websiteUsage[w] < 2)
        if (availableWebsites.length === 0) {
          if (i === 0) alert("No websites available!")
          break
        }

        const randomWebsite = availableWebsites[Math.floor(Math.random() * availableWebsites.length)]
        
        const newAssignment = { team: randomTeam, website: randomWebsite }
        newRolls.push(newAssignment)
        currentSaved.push(newAssignment)
      }

      if (newRolls.length > 0) {
        setCurrentRolls(newRolls)
        
        // Insert new rolls into Supabase
        const { error: insertError } = await supabase
          .from('clonecraft_assignments')
          .insert(newRolls)
          
        if (insertError) {
          console.error("Error inserting into Supabase:", insertError)
          alert("Failed to save to database!")
        }
        
        setTimeout(() => {
          setStep('COMPLETED')
        }, 2000)
      }
    } catch (err) {
      console.error("Failed to roll:", err)
      alert("Error fetching current assignments from database.")
    }
  }

  const resetEvent = () => {
    setCurrentRolls([])
    setStep('ROLL_TEAM_SITE')
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div style={{ textAlign: 'center' }}>
          <Title order={1} c="blue">
            Clone Craft Event
          </Title>
          <Text c="dimmed" size="lg" mt="sm">
            Roll the dice to determine your team's fate!
          </Text>
        </div>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder radius="lg" p="xl" h="100%" shadow="sm">
              <Title order={3} mb="xl" ta="center">Event Actions</Title>
              
              {step === 'ROLL_TEAM_SITE' && (
                <Dice3D 
                  label="Roll for Teams & Problem Statements" 
                  onRollComplete={handleRoll1Complete} 
                />
              )}

              {step === 'COMPLETED' && (
                <Stack align="center" gap="md" mt="xl">
                  <Badge color="green" size="xl" variant="light" leftSection={<IconCheck size={16} />}>
                    Allotment Complete
                  </Badge>
                  <Text ta="center" c="dimmed">
                    {currentRolls.length} teams have been assigned. They are ready to start hacking!
                  </Text>
                  <Group mt="md">
                    <Button variant="light" onClick={resetEvent}>Roll Again</Button>
                    <Button onClick={() => navigate('/admin/clone-craft/round2')}>View All Assignments</Button>
                  </Group>
                </Stack>
              )}
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder radius="lg" p="xl" h="100%" shadow="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
              <Title order={3} mb="xl">Current Allotment ({currentRolls.length})</Title>
              
              <Stack gap="lg">
                <Transition mounted={currentRolls.length > 0} transition="fade" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Table striped>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Team Name</Table.Th>
                            <Table.Th>Website to Clone</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {currentRolls.map((roll, idx) => (
                            <Table.Tr key={idx}>
                              <Table.Td fw={600}>{roll.team}</Table.Td>
                              <Table.Td>
                                <Group gap="xs">
                                  <Text component="a" href={roll.website} target="_blank" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} fw={600} style={{ textDecoration: 'none' }}>
                                    {roll.website}
                                  </Text>
                                  <IconExternalLink size={14} style={{ color: 'var(--mantine-color-blue-6)' }} />
                                </Group>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </div>
                  )}
                </Transition>

                {currentRolls.length === 0 && (
                  <Text c="dimmed" fs="italic" ta="center" mt="xl">
                    Awaiting dice roll...
                  </Text>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}
