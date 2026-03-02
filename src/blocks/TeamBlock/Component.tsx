import React from 'react'
import Link from 'next/link'
import type { TeamBlock as TeamBlockProps, Team } from '@/payload-types'
import Image from 'next/image'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const TeamBlockComponent: React.FC<TeamBlockProps> = async (props) => {
  const { badge = 'Team', title, description, members: memberRelations } = props

  let members: Team[] = []

  if (memberRelations && memberRelations.length > 0) {
    const payload = await getPayload({ config: configPromise })

    const memberIds = memberRelations.map((member) => {
      if (typeof member === 'object') return member.id
      else return member
    })

    const fetchedMembers = await payload.find({
      collection: 'team',
      depth: 1,
      where: {
        id: {
          in: memberIds,
        },
      },
      pagination: false,
    })

    // Sort the fetched members to match the order in memberIds
    members = memberIds
      .map((id) => fetchedMembers.docs.find((doc) => doc.id === id))
      .filter((doc): doc is Team => doc !== undefined)
  }

  if (members.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
      <div className="container mx-auto  border-t">
        <span className="text-caption -ml-6 -mt-3.5 block w-max bg-gray-50 px-6 dark:bg-gray-950">
          {badge}
        </span>

        <div className="mt-4s gap-4 sm:grid sm:grid-cols-2 md:mt-24">
          <div className="sm:w-2/5">
            <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
          </div>

          <div className="mt-6 sm:mt-0">
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="mt-12 md:mt-24">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, index) => {
              const image = member.image
              const imageUrl = typeof image === 'object' && image?.url ? image.url : ''

              const socialLink =
                member.linkedin ||
                member.facebook ||
                member.instagram ||
                (member.email ? `mailto:${member.email}` : '#')

              return (
                <div key={member.id} className="group overflow-hidden">
                  <div className="relative h-85 w-full overflow-hidden rounded-md transition-all duration-500 group-hover:h-[20rem] group-hover:rounded-xl border border-primary">
                    {imageUrl ? (
                      <Image
                        className="border border-primary/60 border-2 h-full w-full object-cover object-top transition-all duration-500 hover:grayscale"
                        src={imageUrl}
                        alt={member.name || 'Team member'}
                        width={800}
                        height={1200}
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                    <div className="flex justify-between">
                      <h3 className="text-2xl font-bold transition-all duration-500 group-hover:tracking-wider">
                        {member.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">_0{index + 1}</span>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-muted-foreground inline-block translate-y-6 text-lg">
                        {member.position}
                      </span>

                      {socialLink !== '#' && (
                        <Link
                          href={socialLink}
                          className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
                        >
                          {member.linkedin
                            ? 'LinkedIn'
                            : member.facebook
                              ? 'Facebook'
                              : member.instagram
                                ? 'Instagram'
                                : member.email
                                  ? 'Email'
                                  : 'Profile'}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
